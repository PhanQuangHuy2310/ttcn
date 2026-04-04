package com.ttcn.backend.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        // Limit: 100 requests per 1 minute
        long capacity = 100;
        Refill refill = Refill.greedy(100, Duration.ofMinutes(1));
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
            
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        
        // Identify client by IP address
        String clientIp = request.getRemoteAddr();
        
        // Fetch or create a bucket for this IP
        Bucket bucket = cache.computeIfAbsent(clientIp, k -> createNewBucket());
        
        // Try to consume a token
        if (bucket.tryConsume(1)) {
            // Token consumed, proceed with the request
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            // Limit exceeded, reject the request
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\": \"Bạn đã thao tác quá nhanh, vui lòng thử lại sau\"}");
        }
    }
}
