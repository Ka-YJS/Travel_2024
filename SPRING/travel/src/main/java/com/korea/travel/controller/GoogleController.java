package com.korea.travel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.korea.travel.dto.GoogleDTO;
import com.korea.travel.model.GoogleEntity;
import com.korea.travel.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/travel/oauth2")
@RequiredArgsConstructor
public class GoogleController {
    private final CustomOAuth2UserService service;
    private final HttpSession httpSession;

    @PostMapping("/google/callback")
    public ResponseEntity<?> handleGoogleCallback(
        @RequestBody Map<String, String> payload
    ) {
        try {
            log.info("Received callback payload: {}", payload);  // 전체 페이로드 로깅

            String credential = payload.get("credential");
            log.info("Extracted credential: {}", 
                credential != null ? "present (length: " + credential.length() + ")" : "null");

            if (credential == null || credential.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Credential is missing or empty"));
            }

            GoogleDTO.Session googleUser = service.verifyAndGetUserInfo(credential);
            String token = service.generateToken(googleUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", googleUser);
            
            return ResponseEntity.ok(response);

        } catch (OAuth2AuthenticationException e) {
            log.error("Authentication error: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Authentication failed");
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "Unknown authentication error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            
        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/google/token")
    public ResponseEntity<?> generateToken(@RequestBody GoogleDTO.dto googleUser) {
        try {
            String token = service.generateToken(googleUser);
            return ResponseEntity.ok().body(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found");
        }
    }

    @PostMapping("/google/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String authorizationHeader,
            HttpSession session
    ) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            if (!service.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            session.invalidate();
            return ResponseEntity.ok().body("Logout successful");
        } catch (Exception e) {
            log.error("Logout error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Logout failed");
        }
    }
}