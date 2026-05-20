package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.AuthenticationRequest;
import com.backend.bikerental.dto.request.IntrospectRequest;
import com.backend.bikerental.dto.request.LogoutRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.AuthenticationResponse;
import com.backend.bikerental.dto.response.IntrospectResponse;
import com.backend.bikerental.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {
    AuthenticationService authenticationService;
    //TEST CONTROLLER
    @GetMapping("/test")
    public String test()
    {
        return "Test controller ok!";
    }
    //LOGIN
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request)
    {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    
    //LOGOUT
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException
    {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logged out successfully")
                .build();
    }
    
    //INTROSPECT
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException
    {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

}
