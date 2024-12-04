package com.korea.travel.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.korea.travel.dto.EmailAuthResponseDto;
import com.korea.travel.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;

    // 인증번호 전송
    @GetMapping("/auth")
    public EmailAuthResponseDto sendAuthCode(@RequestParam String address) {
        return emailService.sendEmail(address);
    }

    // 인증번호 검증
    @PostMapping("/auth")
    public EmailAuthResponseDto checkAuthCode(@RequestParam String address, @RequestParam String authCode) {
        return emailService.validateAuthCode(address, authCode);
    }
}