package com.backend.bikerental.module.booking;

import com.backend.bikerental.module.booking.dto.BookingCreationRequest;
import com.backend.bikerental.module.booking.dto.BookingResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel= "spring")
public interface BookingMapper {
    Booking toBooking(BookingCreationRequest request);
    @Mapping(target = "id", source = "id")
    BookingResponse toBookingResponse(Booking booking);
    List<BookingResponse> toListBookingResponse(List<Booking> bookings);
}
