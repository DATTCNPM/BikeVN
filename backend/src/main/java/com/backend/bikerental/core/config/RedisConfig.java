package com.backend.bikerental.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Value("${spring.data.redis.password}")
    private String redisPassword;

    @Value("${spring.data.redis.ssl.enabled:false}")
    private boolean sslEnabled;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        if (redisPassword != null && !redisPassword.isEmpty()) {
            config.setPassword(redisPassword);
        }

        // Bơm "thuốc bổ" cho Lettuce
        LettuceClientConfiguration.LettuceClientConfigurationBuilder builder = LettuceClientConfiguration.builder()
                .commandTimeout(Duration.ofSeconds(10)); // Timeout nếu Redis không phản hồi

        // Chìa khóa chống đứt kết nối ngầm trên Cloud
        builder.clientOptions(io.lettuce.core.ClientOptions.builder()
                .socketOptions(io.lettuce.core.SocketOptions.builder()
                        .keepAlive(true) // Liên tục ping để Load Balancer không cắt
                        .build())
                .autoReconnect(true)
                .build());

        // Bật SSL nếu Render/Upstash yêu cầu (Rất quan trọng trên Cloud)
        if (sslEnabled) {
            builder.useSsl();
        }

        LettuceConnectionFactory factory = new LettuceConnectionFactory(config, builder.build());

        // Bắt buộc Lettuce phải tự động kiểm tra và nối lại (reconnect) nếu bị đứt
        factory.setValidateConnection(true);

        return factory;
    }
}