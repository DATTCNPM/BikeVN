package com.backend.bikerental.exception;

/**
 * Exception thrown when payment details don't match.
 * 
 * Scenarios:
 * - Webhook amount doesn't match the amount in database
 * - Webhook amount doesn't match the requested amount
 * - Payment metadata inconsistency
 * 
 * This indicates a serious issue that requires investigation:
 * - Payment provider might be sending wrong data
 * - Database corruption
 * - Man-in-the-middle attack (less likely with HTTPS)
 */
public class PaymentMismatchException extends RuntimeException {
    
    public PaymentMismatchException(String message) {
        super(message);
    }
    
    public PaymentMismatchException(String message, Throwable cause) {
        super(message, cause);
    }
}
