package com.korea.travel.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "googles")
public class GoogleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String googleId;      //구글 고유 ID
    private String name;          //구글 계정 이름
    private String email;         //구글 이메일
    private String picture;       //프로필 이미지
    private String createdAt;     //생성 시간
    private String authProvider;  //인증 제공자 (예: "Google")
    
    @Enumerated(EnumType.STRING)
    private Role role;            //사용자 권한
    
    //프로필 업데이트 메소드
    public GoogleEntity update(String name, String email, String picture) {
        this.name = name;
        this.email = email;
        this.picture = picture;
        return this;
    }
    
    //권한 키 조회 메소드
    public String getRoleKey() {
        return this.role.getKey();
    }
    
    //GoogleOAuthUserServiceImpl용 업데이트 메소드
    public void updateInfo(String name, String picture) {
        this.name = name;
        this.picture = picture;
    }
    
    //OAuth 정보 업데이트 메소드
    public void updateOAuthInfo(String name, String picture, String authProvider) {
        this.name = name;
        this.picture = picture;
        this.authProvider = authProvider;
    }
    
    @PrePersist
    protected void onCreate() {
        if (role == null) {
            role = Role.USER; // 기본 역할을 USER로 설정
        }
    }
}