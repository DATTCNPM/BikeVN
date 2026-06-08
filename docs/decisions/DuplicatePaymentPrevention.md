# Duplicate Payment Prevention Strategy

## 📋 Overview

This document describes the comprehensive strategy to prevent duplicate payments in the BikeVN booking system. Multiple payment attempts can occur due to:
- Network retries from payment gateway callbacks
- User clicking submit multiple times
- Request timeout and retry logic
- System failures and recovery

## 🔒 Database-Level Constraints

### 1. Unique Constraints

```sql
-- Prevent duplicate transactions from external payment provider
UNIQUE KEY `unique_transaction_code` (`transaction_code`)

-- Allow only one payment of each type (deposit/rental) per booking
UNIQUE KEY `unique_booking_type` (`booking_id`,`type`)

-- Prevent duplicate API requests via idempotency key
UNIQUE KEY `unique_idempotency_key` (`idempotency_key`)
```

### Schema Details

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `id` | VARCHAR(36) | UUID primary key | `1be094c5-c813-4dd5-bfd0-da3725cf7548` |
| `booking_id` | VARCHAR(36) | Foreign key to booking | `d68cc7f7-a578-4efb-baaa-6ab8f72be8fa` |
| `amount` | DECIMAL(10,2) | Payment amount in VND | `1500000` |
| `type` | ENUM | Payment type | `'deposit'` or `'rental'` |
| `payment_method` | VARCHAR(50) | Payment method | `'credit_card'`, `'cash'`, `'transfer'` |
| `status` | ENUM | Payment status | `'pending'`, `'completed'`, `'failed'`, `'refunded'` |
| `transaction_code` | VARCHAR(100) | External transaction ID | `'TXN001'` (from payment provider) |
| `idempotency_key` | VARCHAR(100) | Unique request ID | `'IDEM-20240115-001'` |
| `paid_at` | DATETIME | Payment completion time | `2024-01-15 18:30:00` |
| `created_at` | DATETIME | Record creation time | AUTO |
| `updated_at` | DATETIME | Record update time | AUTO |

## 🎯 Multi-Layer Prevention Strategy

### Layer 1: Database Constraints (Hard Block)

**Purpose**: Prevent impossible states

```
┌─────────────────────────────────┐
│ Payment Request Arrives          │
└────────────┬────────────────────┘
             │
    ┌────────▼─────────┐
    │ Check Constraints │
    └────────┬─────────┘
             │
    ┌────────▼────────────────────────┐
    │ 1. unique_transaction_code       │
    │    - Block duplicate external TX │
    │                                  │
    │ 2. unique_booking_type           │
    │    - Allow max 1 payment/type    │
    │                                  │
    │ 3. unique_idempotency_key        │
    │    - Prevent duplicate requests  │
    └────────┬────────────────────────┘
             │
    ┌────────▼───────────┐
    │ INSERT or FAIL      │
    └─────────────────────┘
```

### Layer 2: Application-Level Deduplication

#### 2.1 Request-Level Deduplication (Idempotency)

```java
@Service
public class PaymentService {
    
    /**
     * Create payment with idempotency support
     * Same idempotency_key returns same result
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public PaymentDTO createPayment(CreatePaymentRequest request) {
        
        // Step 1: Check if idempotency_key already processed
        Optional<Payment> existingPayment = 
            paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
        
        if (existingPayment.isPresent()) {
            // Return existing payment result (idempotent)
            return convertToDTO(existingPayment.get());
        }
        
        // Step 2: Validate payment doesn't already exist for this booking+type
        if (paymentRepository.existsByBookingIdAndType(
            request.getBookingId(), 
            request.getType()
        )) {
            throw new PaymentAlreadyExistsException(
                "Payment of type " + request.getType() + 
                " already exists for booking " + request.getBookingId()
            );
        }
        
        // Step 3: Create new payment
        Payment payment = new Payment();
        payment.setId(UUID.randomUUID().toString());
        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());
        payment.setType(request.getType());
        payment.setIdempotencyKey(request.getIdempotencyKey());
        payment.setTransactionCode(request.getTransactionCode());
        payment.setStatus(PaymentStatus.PENDING);
        
        // Step 4: Save (will fail if constraint violated)
        return convertToDTO(paymentRepository.save(payment));
    }
}
```

#### 2.2 Payment Gateway Callback Deduplication

```java
@Service
public class PaymentCallbackService {
    
    /**
     * Process webhook callback from payment provider
     * Handles retries and duplicate notifications
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void processPaymentCallback(PaymentWebhookDTO webhook) {
        
        String transactionCode = webhook.getTransactionId();
        
        try {
            // Step 1: Check if transaction already processed
            Optional<Payment> existingPayment = 
                paymentRepository.findByTransactionCode(transactionCode);
            
            if (existingPayment.isPresent()) {
                Payment payment = existingPayment.get();
                
                // Step 2: Verify consistency with webhook
                if (!payment.getAmount().equals(webhook.getAmount())) {
                    log.error(
                        "Amount mismatch for transaction {}: DB={}, Webhook={}",
                        transactionCode, 
                        payment.getAmount(), 
                        webhook.getAmount()
                    );
                    throw new PaymentMismatchException("Amount mismatch");
                }
                
                // Step 3: If already completed, just confirm
                if (payment.getStatus() == PaymentStatus.COMPLETED) {
                    log.info("Transaction {} already completed, returning cached result", 
                        transactionCode);
                    return;
                }
                
                // Step 4: If still pending, update to completed
                if (payment.getStatus() == PaymentStatus.PENDING) {
                    payment.setStatus(PaymentStatus.COMPLETED);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);
                    
                    // Trigger booking approval
                    bookingService.approveBooking(payment.getBookingId());
                }
                return;
            }
            
            // Step 5: New transaction - look up booking
            String bookingId = webhook.getBookingId();
            Booking booking = bookingService.getBooking(bookingId);
            
            // Step 6: Create new payment record
            Payment payment = new Payment();
            payment.setId(UUID.randomUUID().toString());
            payment.setBookingId(bookingId);
            payment.setAmount(webhook.getAmount());
            payment.setType(webhook.getType());
            payment.setPaymentMethod(webhook.getPaymentMethod());
            payment.setTransactionCode(transactionCode);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            
            paymentRepository.save(payment);
            
            // Step 7: Process booking
            bookingService.approveBooking(bookingId);
            
        } catch (DataIntegrityViolationException e) {
            // Database constraint violation - likely duplicate
            log.warn("Duplicate payment detected for transaction {}", transactionCode);
            
            // Verify and confirm the existing payment instead
            Optional<Payment> payment = 
                paymentRepository.findByTransactionCode(transactionCode);
            if (payment.isPresent()) {
                log.info("Existing payment found, confirming: {}", transactionCode);
                return;
            }
            
            throw e;
        }
    }
}
```

#### 2.3 Concurrent Request Handling

```java
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    /**
     * Create payment endpoint
     * Requires idempotency-key header
     */
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(
        @RequestBody CreatePaymentRequest request,
        @RequestHeader(value = "Idempotency-Key") String idempotencyKey
    ) {
        try {
            request.setIdempotencyKey(idempotencyKey);
            PaymentDTO payment = paymentService.createPayment(request);
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(payment);
                
        } catch (PaymentAlreadyExistsException e) {
            // Payment of this type already exists
            return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409
                .body(new ErrorResponse(
                    "PAYMENT_ALREADY_EXISTS",
                    e.getMessage()
                ));
                
        } catch (DataIntegrityViolationException e) {
            // Constraint violation (duplicate transaction code, etc)
            return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409
                .body(new ErrorResponse(
                    "DUPLICATE_PAYMENT",
                    "Payment with this transaction code already exists"
                ));
        }
    }
    
    /**
     * Payment gateway webhook endpoint
     * Receives callback notifications
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> paymentWebhook(
        @RequestBody PaymentWebhookDTO webhook,
        @RequestHeader(value = "X-Signature") String signature
    ) {
        try {
            // Step 1: Verify webhook signature
            if (!verifyWebhookSignature(webhook, signature)) {
                log.warn("Invalid webhook signature");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Step 2: Process callback (handles duplicates internally)
            paymentCallbackService.processPaymentCallback(webhook);
            
            // Step 3: Return success
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            log.error("Error processing payment webhook", e);
            // Return 5xx so provider retries
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }
}
```

## 🔄 Flow Diagrams

### Normal Payment Flow

```
Client                  API                Database
  │                      │                    │
  ├─ POST /payments ────→ │                    │
  │  (idempotency-key)   │                    │
  │                      ├─ Check duplicate ─→ │ (NO)
  │                      │                    │
  │                      ├─ INSERT payment ──→ │ (SUCCESS)
  │                      │                    │
  │                      ← Payment record ────┤
  │ ← 201 Created ───────┤                    │
  │                      │                    │

Payment Provider      API                Database
  │                      │                    │
  ├─ POST /webhook ─────→ │                    │
  │  (transaction_code)  │                    │
  │                      ├─ Check by code ───→ │ (NOT FOUND)
  │                      │                    │
  │                      ├─ INSERT payment ──→ │ (SUCCESS)
  │                      │                    │
  │                      ├─ UPDATE booking ──→ │ (APPROVED)
  │                      │                    │
  │ ← 200 OK ────────────┤                    │
```

### Duplicate Request Prevention

```
Request 1              API                Database
  │                      │                    │
  ├─ POST /payments ────→ │                    │
  │  (idempotency-key-A) │                    │
  │                      ├─ Check A ────────→ │ (NEW)
  │                      ├─ INSERT ─────────→ │ (OK)
  │ ← 201 Created ───────┤                    │
  │                      │                    │

Request 2              API                Database
  ├─ POST /payments ────→ │                    │
  │  (same key A)        │                    │
  │                      ├─ Check A ────────→ │ (EXISTS)
  │                      │                    │
  │ ← 201 Created ───────┤ (Return cached)    │
  │  (same response)     │                    │
```

### Duplicate Webhook Prevention

```
Webhook 1              API                Database
  │                      │                    │
  ├─ POST /webhook ─────→ │                    │
  │  (TXN001)            │                    │
  │                      ├─ Check TXN001 ───→ │ (NEW)
  │                      ├─ INSERT ─────────→ │ (OK)
  │                      ├─ UPDATE booking ──→ │ (APPROVED)
  │ ← 200 OK ────────────┤                    │
  │                      │                    │

Webhook 2              API                Database
  ├─ POST /webhook ─────→ │                    │
  │  (same TXN001)       │                    │
  │  [RETRY]             │                    │
  │                      ├─ Check TXN001 ───→ │ (EXISTS)
  │                      │                    │
  │                      ├─ Verify amount ───→ │ (MATCH)
  │                      │                    │
  │ ← 200 OK ────────────┤ (Idempotent)       │
  │  (no side effects)   │                    │
```

## 🛡️ Constraint Details

### 1. `unique_transaction_code`

**Scenario**: Payment provider sends duplicate webhook

```sql
-- First webhook
INSERT INTO payments (id, transaction_code, booking_id, type, amount, status) 
VALUES ('pay-001', 'TXN001', 'book-001', 'rental', 1500000, 'completed');
-- SUCCESS

-- Duplicate webhook (same TXN001)
INSERT INTO payments (id, transaction_code, booking_id, type, amount, status) 
VALUES ('pay-002', 'TXN001', 'book-001', 'rental', 1500000, 'completed');
-- ERROR: Duplicate entry for key 'unique_transaction_code'
```

### 2. `unique_booking_type`

**Scenario**: User completes deposit payment twice

```sql
-- First deposit payment
INSERT INTO payments (id, booking_id, type, transaction_code, amount) 
VALUES ('pay-001', 'book-001', 'deposit', 'TXN001', 500000);
-- SUCCESS

-- Duplicate deposit for same booking
INSERT INTO payments (id, booking_id, type, transaction_code, amount) 
VALUES ('pay-002', 'book-001', 'deposit', 'TXN002', 500000);
-- ERROR: Duplicate entry for key 'unique_booking_type'
```

**Note**: A booking can have:
- ✅ 1 deposit + 1 rental = allowed (different types)
- ❌ 2 deposits = blocked
- ❌ 2 rentals = blocked

### 3. `unique_idempotency_key`

**Scenario**: Client sends same request twice

```sql
-- First request
INSERT INTO payments (id, idempotency_key, booking_id, type, amount) 
VALUES ('pay-001', 'IDEM-20240115-001', 'book-001', 'rental', 1500000);
-- SUCCESS

-- Same request (client retry)
INSERT INTO payments (id, idempotency_key, booking_id, type, amount) 
VALUES ('pay-002', 'IDEM-20240115-001', 'book-001', 'rental', 1500000);
-- ERROR: Duplicate entry for key 'unique_idempotency_key'
```

## 📊 Index Strategy

### Query Optimization Indexes

```sql
-- Lookup by transaction code (webhook processing)
KEY `idx_transaction_code` (`transaction_code`)

-- Lookup by idempotency key (request deduplication)
KEY `idx_idempotency_key` (`idempotency_key`)

-- Query payment status for booking (composite)
KEY `idx_booking_status_type` (`booking_id`, `status`, `type`)

-- General queries
KEY `idx_booking_id` (`booking_id`)
KEY `idx_status` (`status`)
KEY `idx_type` (`type`)
```

## 🚀 Implementation Checklist

### Database
- [x] Add `idempotency_key` column
- [x] Add `updated_at` timestamp
- [x] Create `unique_transaction_code` constraint
- [x] Create `unique_booking_type` constraint
- [x] Create `unique_idempotency_key` constraint
- [x] Add composite index `idx_booking_status_type`
- [x] Update table comment with deduplication info

### Backend Service Layer
- [ ] Create `PaymentService` with deduplication logic
- [ ] Implement `findByTransactionCode()` in repository
- [ ] Implement `findByIdempotencyKey()` in repository
- [ ] Implement `existsByBookingIdAndType()` in repository
- [ ] Add transaction isolation level SERIALIZABLE
- [ ] Add proper exception handling

### REST API Controller
- [ ] Create `PaymentController` endpoints
- [ ] Add `Idempotency-Key` header validation
- [ ] Implement 201 Created for new payments
- [ ] Implement 409 Conflict for duplicates
- [ ] Add payment webhook endpoint
- [ ] Verify webhook signature

### Webhook Handler
- [ ] Create `PaymentCallbackService`
- [ ] Implement signature verification
- [ ] Handle amount mismatch detection
- [ ] Trigger booking approval on success
- [ ] Proper error logging and monitoring

### Testing
- [ ] Unit test: duplicate transaction_code
- [ ] Unit test: duplicate booking_type
- [ ] Unit test: duplicate idempotency_key
- [ ] Integration test: concurrent requests
- [ ] Integration test: webhook retries
- [ ] Load test: high-volume payments

## 📝 Example Queries

### Check payment status
```sql
SELECT id, booking_id, type, status, transaction_code, paid_at
FROM payments
WHERE booking_id = 'book-001'
ORDER BY created_at DESC;
```

### Find duplicate payments by transaction
```sql
SELECT transaction_code, COUNT(*) as count, GROUP_CONCAT(id) as payment_ids
FROM payments
WHERE transaction_code IS NOT NULL
GROUP BY transaction_code
HAVING count > 1;
```

### Find payments waiting for completion
```sql
SELECT id, booking_id, type, amount, status, created_at
FROM payments
WHERE status = 'pending'
  AND created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
ORDER BY created_at DESC;
```

### Check booking payment status
```sql
SELECT 
  b.id as booking_id,
  b.status as booking_status,
  MAX(CASE WHEN p.type = 'deposit' THEN p.status ELSE NULL END) as deposit_status,
  MAX(CASE WHEN p.type = 'rental' THEN p.status ELSE NULL END) as rental_status,
  COUNT(p.id) as payment_count
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
WHERE b.id = 'book-001'
GROUP BY b.id;
```

## 🔐 Security Considerations

1. **Webhook Signature Verification**: Always verify webhook authenticity
2. **Amount Validation**: Check amount matches between request and callback
3. **Rate Limiting**: Limit payment creation requests per user/booking
4. **Audit Trail**: Log all payment attempts and status changes
5. **PCI Compliance**: Don't store full card numbers

## 📚 References

- [Idempotency in APIs](https://stripe.com/blog/idempotency)
- [Payment Reconciliation](https://www.adyen.com/knowledge-hub/payment-reconciliation)
- [Duplicate Prevention Pattern](https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html)

---

**Last Updated**: June 2, 2026  
**Status**: ✅ Complete - Schema and Documentation
