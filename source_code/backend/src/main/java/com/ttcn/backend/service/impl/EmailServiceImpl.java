package com.ttcn.backend.service.impl;

import com.ttcn.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String userName) {
        log.info("Bắt đầu gửi email chào mừng (Bất đồng bộ) tới {}", toEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Chào mừng bạn đến với LMS");
            message.setText("Xin chào " + userName + ",\n\nCảm ơn bạn đã đăng nhập và đăng ký tài khoản trên hệ thống LMS. Chúc bạn có một trải nghiệm học tập tuyệt vời!\n\nTrân trọng,\nĐội ngũ quản trị LMS");
            
            mailSender.send(message);
            log.info("Gửi email thành công tới {}", toEmail);
        } catch (Exception e) {
            log.error("Có lỗi xảy ra khi gửi email tới {}: {}", toEmail, e.getMessage());
        }
    }
}
