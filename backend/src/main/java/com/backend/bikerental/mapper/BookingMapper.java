package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.BookingCreationRequest;
import com.backend.bikerental.dto.response.BookingResponse;
import com.backend.bikerental.entity.Booking;
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
