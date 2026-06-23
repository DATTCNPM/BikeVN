package com.backend.bikerental.module.booking;

import com.backend.bikerental.module.booking.enums.BookingLockEnum;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.vehicle.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingLockService {
    BookingLockRepository bookingLockRepository;
    VehicleRepository vehicleRepository;
    @Transactional
    public void createLock(String vehicleId, String userId, LocalDateTime start, LocalDateTime end, int lockMinutes)
    {
        //Goi luong nay truoc duoc xu ly xe truoc
        vehicleRepository.findByIdForUpdate(vehicleId)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        if(bookingLockRepository.existsActiveLockByOthers(vehicleId, userId, start, end))
        {
            throw new AppException(ErrorCode.VEHICLE_ALREADY_LOCKED);
        }

        BookingLock bookingLock = new BookingLock();
        bookingLock.setVehicleId(vehicleId);
        bookingLock.setUserId(userId);
        bookingLock.setStartTime(start);
        bookingLock.setEndTime(end);
        bookingLock.setStatus(BookingLockEnum.active);
        bookingLock.setLockExpiresAt(LocalDateTime.now().plusMinutes(lockMinutes));

        bookingLockRepository.save(bookingLock);
    }

    @Transactional
    public BookingLock validateLock(String vehicleId, String userId)
    {
        return bookingLockRepository.findActiveLock(vehicleId, userId)
                .orElseThrow(()-> new AppException(ErrorCode.LOCK_NOT_FOUND));
    }

    @Transactional
    public void releaseLock(BookingLock bookingLock)
    {
        bookingLock.setStatus(BookingLockEnum.released);
        bookingLockRepository.save(bookingLock);
    }

    @Transactional
    public void releaseLockByVehicleAndUser(String vehicleId, String userId)
    {
        bookingLockRepository.findActiveLock(vehicleId, userId)
                .ifPresent(lock -> {
                    lock.setStatus(BookingLockEnum.released);
                    bookingLockRepository.save(lock);
                });
    }
}
