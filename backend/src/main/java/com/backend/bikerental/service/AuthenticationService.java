package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.AuthenticationRequest;
import com.backend.bikerental.dto.request.IntrospectRequest;
import com.backend.bikerental.dto.request.LogoutRequest;
import com.backend.bikerental.dto.response.AuthenticationResponse;
import com.backend.bikerental.dto.response.IntrospectResponse;
import com.backend.bikerental.entity.InvalidateToken;
import com.backend.bikerental.entity.User;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.repository.InvalidatedTokenRepository;
import com.backend.bikerental.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signerKey;


    public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token);
        }
        catch (RuntimeException e)
        {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());
        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
        InvalidateToken invalidateToken = InvalidateToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();
        invalidatedTokenRepository.save(invalidateToken);
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);

        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
        {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if(!verified && expiryTime.after(new Date()))
        {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request)
    {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> {
                    return new AppException(ErrorCode.USER_NOT_EXISTED);
                });

        if(request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if(!authenticated)
        {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }
        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private String generateToken(User user)
    {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("bike.vn")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(10, ChronoUnit.DAYS ).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("branchId",user.getBranch() != null ? user.getBranch().getId() : null)
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try
        {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        }
        catch (JOSEException e)
        {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
    private String buildScope(User user)
    {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles()))
        {
            user.getRoles().forEach(role ->
                stringJoiner.add("ROLE_"+ role.getName())
            );
        }
        return stringJoiner.toString();
    }
}
