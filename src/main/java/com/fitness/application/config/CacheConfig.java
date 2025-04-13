
package com.fitness.application.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@EnableCaching
@Configuration
public class CacheConfig {
    
    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new GenericJackson2JsonRedisSerializer()));
        
        // Configure specific TTLs for different caches
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Frequently accessed data with short TTL
        cacheConfigurations.put("workouts", 
                defaultConfig.entryTtl(Duration.ofHours(1)));
        
        cacheConfigurations.put("goals", 
                defaultConfig.entryTtl(Duration.ofHours(2)));
        
        cacheConfigurations.put("progress", 
                defaultConfig.entryTtl(Duration.ofHours(3)));
        
        cacheConfigurations.put("streaks", 
                defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // User profile cache - longer TTL as it changes less frequently
        cacheConfigurations.put("users", 
                defaultConfig.entryTtl(Duration.ofHours(6)));
        
        // API rate limit cache - very short TTL
        cacheConfigurations.put("ratelimit", 
                defaultConfig.entryTtl(Duration.ofMinutes(2)));
        
        // Recent activities cache - very short TTL for fresh data
        cacheConfigurations.put("recent_activities", 
                defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }
}
