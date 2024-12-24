CREATE DATABASE travel;

SHOW DATABASES;

USE travel;

-- users 테이블 생성
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    user_name VARCHAR(255) NOT NULL,
    user_nick_name VARCHAR(255) NOT NULL,
	user_phone_number VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_profile_image VARCHAR(255),
    user_created_at VARCHAR(255) NOT NULL
);

-- posts 테이블 생성
CREATE TABLE posts (
    post_id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 고유 ID (자동 증가)
    post_title VARCHAR(255) NOT NULL,            -- 게시글 제목 (NOT NULL 제약조건)
    post_content TEXT,                           -- 게시글 내용 (TEXT 타입)
    user_nickname VARCHAR(255) NOT NULL,         -- 사용자 닉네임
    post_created_at VARCHAR(255),                -- 게시글 작성 시간 (문자열로 저장)
    user_id BIGINT,                              -- 외래 키 (UserEntity와 연결)

    -- 외래 키 설정
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- placeList와 imageUrls는 @ElementCollection 어노테이션을 사용하였으므로, 별도의 테이블로 관리해야 합니다.
-- 각각 placeList, imageUrls에 대해 별도의 테이블을 생성해줍니다.

-- placeList를 위한 테이블
CREATE TABLE post_places (
    post_id BIGINT,                                 -- 게시글 ID (외래 키)
    place_list VARCHAR(255),                             -- 장소 이름
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- imageUrls를 위한 테이블
CREATE TABLE post_images (
    post_id BIGINT,                                 -- 게시글 ID (외래 키)
    image_urls VARCHAR(255),                          -- 이미지 URL
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    post_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);




CREATE TABLE googles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL,  -- 구글 고유 ID
    name VARCHAR(255) NOT NULL,       -- 구글 계정 이름
    email VARCHAR(255) NOT NULL,      -- 구글 이메일
    picture VARCHAR(255),             -- 프로필 이미지
    created_at VARCHAR(255),          -- 생성 시간
    auth_provider VARCHAR(255),       -- 인증 제공자 (예: "Google")
    role VARCHAR(255) DEFAULT 'USER', -- 사용자 권한 (기본값은 'USER')
    UNIQUE (google_id),               -- 구글 고유 ID는 유니크
    UNIQUE (email)                    -- 이메일도 유니크
);


SHOW TABLES;

DESCRIBE users;
DESCRIBE posts;
DESCRIBE post_places;
DESCRIBE post_images;
DESCRIBE likes;

-- users 테이블 조회
SELECT * FROM users;
-- posts 테이블 조회
SELECT * FROM posts;
-- post_places 테이블 조회
SELECT * FROM post_places;
-- post_images 테이블 조회
SELECT * FROM post_images;
-- likes 테이블 조회
SELECT * FROM likes;
-- googles 테이블 조회
SELECT * FROM googles;




-- users 테이블 삭제
DROP TABLE IF EXISTS users;
-- posts 테이블 삭제
DROP TABLE IF EXISTS posts;
-- post_places 테이블 삭제
DROP TABLE IF EXISTS post_places;
-- post_images 테이블 삭제
DROP TABLE IF EXISTS post_images;
-- likes 테이블 삭제
DROP TABLE IF EXISTS likes;
-- googles 테이블 삭제
DROP TABLE IF EXISTS googles;




CREATE USER 'root'@'%' IDENTIFIED BY '1111';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;



ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '1111';
FLUSH PRIVILEGES;