package com.korea.travel.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.korea.travel.model.GoogleEntity;

public interface GoogleRepository extends JpaRepository<GoogleEntity, Long> {
    Optional<GoogleEntity> findByEmail(String email); // 이메일로 사용자 조회
    
    Optional<GoogleEntity> findByGoogleId(String googleId); // Google ID로 사용자 조회
    
    Optional<GoogleEntity> findByName(String name); // 이름으로 사용자 조회
    
    Optional<GoogleEntity> findByPicture(String picture); // 프로필 사진으로 사용자 조회
}