package com.example.project.model;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
	
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name="system-uuid", strategy = "uuid")
	private Long id;				//고유 id
	
	private String userId;			//유저Id
	private String userName; 		//유저이름
	private String userNickName;	//닉네임
	private String userPassword;	//비밀번호
	private String authProvider; 	//OAuth 소셜로그인시 사용할 유저 정보 제공자
}
