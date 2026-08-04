package com.technoforce.hunterspd.restfullWebService.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> otpStorage = new HashMap<>();

    public void sendOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpStorage.put(email, otp);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Career Recommendation System - OTP Verification");

            String html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: #0d6efd;
                            color: white;
                            text-align: center;
                            padding: 20px;
                        }
                        .content {
                            padding: 30px;
                            color: #333333;
                            line-height: 1.6;
                        }
                        .otp-box {
                            background: #f8f9fa;
                            border: 2px dashed #0d6efd;
                            color: #0d6efd;
                            font-size: 32px;
                            font-weight: bold;
                            text-align: center;
                            padding: 15px;
                            margin: 25px 0;
                            letter-spacing: 6px;
                        }
                        .footer {
                            background: #f8f9fa;
                            text-align: center;
                            color: #666;
                            padding: 15px;
                            font-size: 13px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">

                        <div class="header">
                            <h2>Career Recommendation System</h2>
                        </div>

                        <div class="content">
                            <h3>Hello,</h3>

                            <p>
                                Thank you for using the <strong>Career Recommendation System</strong>.
                                Please use the following One-Time Password (OTP) to verify your email address.
                            </p>

                            <div class="otp-box">
                                %s
                            </div>

                            <p>
                                This OTP is valid for <strong>5 minutes</strong>.
                                Please do not share this code with anyone.
                            </p>

                            <p>
                                If you did not request this verification, please ignore this email.
                            </p>

                            <p>
                                Regards,<br>
                                <strong>Career Recommendation System Team</strong>
                            </p>
                        </div>

                        <div class="footer">
                            © 2026 Career Recommendation System. All Rights Reserved.
                        </div>

                    </div>
                </body>
                </html>
                """.formatted(otp);

            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    public boolean verifyOtp(String email, String otp) {

        String storedOtp = otpStorage.get(email);

        System.out.println("Entered OTP: " + otp);
        System.out.println("Stored OTP: " + storedOtp);
        System.out.println("Email: " + email);

        if (storedOtp != null && storedOtp.equals(otp.trim())) {
            otpStorage.remove(email);
            return true;
        }

        return false;
    }
}