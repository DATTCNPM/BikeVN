package com.backend.bikerental.core.config; // Đổi lại package theo đúng cấu trúc của bạn

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisKeepAliveService {

    private final StringRedisTemplate stringRedisTemplate;

    @Scheduled(fixedRate = 180000)
    public void keepRedisAwake() {
        try {
            stringRedisTemplate.hasKey("ping_keep_awake");
        } catch (Exception e) {
            log.warn("Redis experienced a brief network drop and is automatically reconnecting...");
        }
    }
}