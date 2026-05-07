package com.ttcn.backend.service;

public interface EmailService {
    void sendWelcomeEmail(String toEmail, String userName);
}
