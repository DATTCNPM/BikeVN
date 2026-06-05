package com.backend.bikerental.service;

import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.entity.BookingLock;
import com.backend.bikerental.enums.BookingLockEnum;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.repository.BookingLockRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingLockService {
    BookingLockRepository bookingLockRepository;
    public void createLock(String vehicleId, String userId, LocalDateTime start, LocalDateTime end, int lockMinutes)
    {
        if(bookingLockRepository.existsActiveLock(vehicleId, start, end))
        {
            throw new AppException(ErrorCode.VEHICLE_ALREADY_LOCKED);
        }

        BookingLock bookingLock = new BookingLock();
        //bookingLock.setId(UUID.randomUUID().toString());
        bookingLock.setVehicleId(vehicleId);
        bookingLock.setUserId(userId);
        bookingLock.setStartTime(start);
        bookingLock.setEndTime(end);
        bookingLock.setStatus(BookingLockEnum.active);
        bookingLock.setLockExpiresAt(LocalDateTime.now().plusMinutes(lockMinutes));

        bookingLockRepository.save(bookingLock);
    }

    public BookingLock validateLock(String vehicleId, String userId)
    {
        return bookingLockRepository.findActiveLock(vehicleId, userId)
                .orElseThrow(()-> new AppException(ErrorCode.LOCK_NOT_FOUND));
    }

    public void releaseLock(BookingLock bookingLock)
    {
        bookingLock.setStatus(BookingLockEnum.released);
        bookingLockRepository.save(bookingLock);
    }

    public void releaseLockByVehicleAndUser(String vehicleId, String userId)
    {
        bookingLockRepository.findActiveLock(vehicleId, userId)
                .ifPresent(lock -> {
                    lock.setStatus(BookingLockEnum.released);
                    bookingLockRepository.save(lock);
                });
    }
}
