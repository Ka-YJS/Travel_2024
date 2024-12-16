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
    post_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_title VARCHAR(255) NOT NULL,
    post_content TEXT,
    user_nickname VARCHAR(255) NOT NULL,
    place_list VARCHAR(255),
    image_urls VARCHAR(255),
    thumbnail VARCHAR(255),
    likes INT DEFAULT 0,
    post_created_at VARCHAR(255),
    user_id BIGINT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

SHOW TABLES;

DESCRIBE users;
DESCRIBE posts;


-- users 테이블 조회
SELECT * FROM users;

-- posts 테이블 조회
SELECT * FROM posts;



-- users 테이블 삭제
-- DROP TABLE IF EXISTS users;

-- posts 테이블 삭제
-- DROP TABLE IF EXISTS posts;

ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '1111';
FLUSH PRIVILEGES;