package com.backend.bikerental.exception;

/**
 * Exception thrown when trying to create a payment that already exists.
 * 
 * Scenarios:
 * - Attempting to create a second DEPOSIT payment for a booking that already has one
 * - Attempting to create a second RENTAL payment for a booking that already has one
 * - Attempting to create a payment with a duplicate transaction code
 */
public class PaymentAlreadyExistsException extends RuntimeException {
    
    public PaymentAlreadyExistsException(String message) {
        super(message);
    }
    
    public PaymentAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
