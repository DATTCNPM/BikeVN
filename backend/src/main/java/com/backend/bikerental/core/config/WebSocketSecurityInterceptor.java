package com.backend.bikerental.core.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class WebSocketSecurityInterceptor implements ChannelInterceptor {
    CustomJWTDecoder customJWTDecoder;
    JwtAuthenticationConverter jwtAuthenticationConverter;
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // 1. Chỉ kiểm tra Token khi Client gửi lệnh CONNECT đầu tiên
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            // 2. Lấy Token từ STOMP Header
            List<String> authorization = accessor.getNativeHeader("Authorization");

            if (authorization == null || authorization.isEmpty() || !authorization.get(0).startsWith("Bearer ")) {
                log.error("WebSocket Authentication Failed: Missing or invalid token format");
                throw new MessageDeliveryException("UNAUTHENTICATED");
            }

            String token = authorization.get(0).substring(7);

            try {
                // 2. Decode và validate token bằng CustomJWTDecoder
                Jwt jwt = customJWTDecoder.decode(token);

                // 3. Chuyển đổi Jwt thành Authentication object
                var authentication = jwtAuthenticationConverter.convert(jwt);

                // 4. Gắn Authentication vào phiên làm việc của STOMP
                accessor.setUser(authentication);
                log.info("WebSocket Authenticated Successfully for user: {}", jwt.getSubject());

            } catch (JwtException e) {
                log.error("WebSocket Authentication Failed: {}", e.getMessage());
                throw new MessageDeliveryException("UNAUTHORIZED");
            }
        }
        return message;
    }
}
