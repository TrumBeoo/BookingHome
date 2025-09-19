from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import time
from collections import defaultdict
from typing import Dict
import logging

# Simple in-memory rate limiter (in production, use Redis)
class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
        self.max_requests = 5  # Max requests per window
        self.window_seconds = 60  # Time window in seconds
    
    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if now - req_time < self.window_seconds
        ]
        
        # Check if limit exceeded
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[client_ip].append(now)
        return True

# Global rate limiter instance
rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware for authentication endpoints"""
    
    # Only apply rate limiting to auth endpoints
    if request.url.path.startswith("/auth/"):
        client_ip = request.client.host
        
        if not rate_limiter.is_allowed(client_ip):
            logging.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Quá nhiều yêu cầu. Vui lòng thử lại sau."}
            )
    
    response = await call_next(request)
    return response

async def security_headers_middleware(request: Request, call_next):
    """Add security headers to responses"""
    response = await call_next(request)
    
    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    return response