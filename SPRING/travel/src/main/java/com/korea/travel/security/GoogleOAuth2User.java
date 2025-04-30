package com.korea.travel.security;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class GoogleOAuth2User implements OAuth2User {
    private final String email;
    private final Collection<? extends GrantedAuthority> authorities;
    private final Map<String, Object> attributes;
    private final String name;
    private final String picture;
    private final String googleId;

    public GoogleOAuth2User(String email, String name, String picture, String googleId, Map<String, Object> attributes) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.googleId = googleId;
        this.attributes = attributes;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getName() {
        return this.email;  // Google의 경우 email을 고유 식별자로 사용
    }

    // 추가 getter 메소드들
    public String getEmail() {
        return this.email;
    }

    public String getDisplayName() {
        return this.name;
    }

    public String getPicture() {
        return this.picture;
    }

    public String getGoogleId() {
        return this.googleId;
    }
}