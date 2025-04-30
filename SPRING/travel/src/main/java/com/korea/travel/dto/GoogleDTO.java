package com.korea.travel.dto;
import java.io.Serializable;
import java.util.Map;
import com.korea.travel.model.GoogleEntity;
import com.korea.travel.model.Role;
import lombok.Builder;
import lombok.Getter;

public class GoogleDTO {
    
    @Getter
    @Builder
    public static class dto {
        private Map<String, Object> attributes;
        private String nameAttributeKey;
        private String name;
        private String email;
        private String picture;
        private String googleId;
        private String createdAt;

        public static dto of(String registrationId, 
                           String userNameAttributeName,
                           Map<String, Object> attributes) {
            return ofGoogle(userNameAttributeName, attributes);
        }

        private static dto ofGoogle(String userNameAttributeName,
                                  Map<String, Object> attributes) {
            return dto.builder()
                    .name((String) attributes.get("name"))
                    .email((String) attributes.get("email"))
                    .picture((String) attributes.get("picture"))
                    .googleId((String) attributes.get("sub"))
                    .attributes(attributes)
                    .nameAttributeKey(userNameAttributeName)
                    .createdAt(java.time.LocalDateTime.now().toString()) // 현재 시간 추가
                    .build();
        }

        public GoogleEntity toEntity() {
            return GoogleEntity.builder()
                    .name(name)
                    .email(email)
                    .picture(picture)
                    .googleId(googleId)
                    .createdAt(createdAt)
                    .role(Role.USER)
                    .build();
        }
    }

    @Getter
    public static class Session implements Serializable {
        private String name;
        private String email;
        private String picture;
        private String googleId;
        private String createdAt;

        public Session(GoogleEntity user) {
            this.name = user.getName();
            this.email = user.getEmail();
            this.picture = user.getPicture();
            this.googleId = user.getGoogleId();
            this.createdAt = user.getCreatedAt();
        }
    }
}