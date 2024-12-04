package com.korea.travel.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WriteDTO {
	
	private Long id;
	private String writeTitle;
	private String writeContent;
	private UserDTO user;
	
}
