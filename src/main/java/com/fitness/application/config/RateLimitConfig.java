
package com.fitness.application.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    @Value("${app.ratelimit.enabled:true}")
    private boolean rateLimitEnabled;
    
    @Value("${app.ratelimit.limit:100}")
    private int rateLimit;
    
    @Value("${app.ratelimit.refresh-period:60}")
    private int refreshPeriod;
    
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    @Bean
    public Map<String, Bucket> buckets() {
        return buckets;
    }
    
    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, this::newBucket);
    }
    
    private Bucket newBucket(String key) {
        return Bucket4j.builder()
                .addLimit(Bandwidth.classic(rateLimit, Refill.intervally(rateLimit, Duration.ofSeconds(refreshPeriod))))
                .build();
    }
    
    public boolean isRateLimitEnabled() {
        return rateLimitEnabled;
    }
}
