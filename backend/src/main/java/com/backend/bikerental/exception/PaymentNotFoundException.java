package com.backend.bikerental.exception;

/**
 * Exception thrown when a payment is not found.
 * 
 * Scenarios:
 * - Attempting to retrieve a payment with non-existent ID
 * - Attempting to refund or mark as failed a payment that doesn't exist
 */
public class PaymentNotFoundException extends RuntimeException {
    
    public PaymentNotFoundException(String message) {
        super(message);
    }
    
    public PaymentNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
