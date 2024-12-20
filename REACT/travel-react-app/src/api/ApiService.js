import axios from 'axios';
import { API_BASE_URL } from '../api/api-config';

export async function call(api, method, request, user, customHeaders = null) {
    // OAuth 요청인지 먼저 확인
    const isOAuthRequest = api.includes('/oauth2/') || api.includes('/login/oauth2/');
    
    // 기본 헤더 설정
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    // OAuth 요청일 경우 특별 헤더 설정
    if (isOAuthRequest && request?.credential) {
        headers = {
            ...headers,
            "Authorization": `Bearer ${request.credential}`,
            "X-Requested-With": "XMLHttpRequest"
        };
    }
    // 일반 인증 토큰이 있는 경우
    else if (user?.token || localStorage.getItem("ACCESS_TOKEN")) {
        const token = user?.token || localStorage.getItem("ACCESS_TOKEN");
        headers["Authorization"] = `Bearer ${token}`;
    }

    // 커스텀 헤더가 있으면 추가
    if (customHeaders) {
        headers = { ...headers, ...customHeaders };
    }

    // 요청 옵션 설정
    const options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
        withCredentials: true
    };

    console.log("최종 요청 설정:", {
        url: options.url,
        method: options.method,
        headers: Object.fromEntries(Object.entries(headers)),
        isOAuth: isOAuthRequest
    });

    if (method.toUpperCase() !== 'GET' && request) {
        options.data = JSON.stringify(request);
    }

    try {
        const response = await axios(options);
        console.log("API 응답:", {
            status: response.status,
            headers: response.headers,
            data: response.data
        });
        return response.data;
    } catch (error) {
        console.error("API 오류:", {
            status: error.response?.status,
            message: error.message,
            responseData: error.response?.data,
            requestHeaders: options.headers
        });
        throw error;
    }
}

// Google OAuth 전용 함수 추가
export async function handleGoogleOAuth(credential) {
    try {
        const response = await call(
            "/travel/oauth2/google/callback",
            "POST",
            { credential: credential }
        );
        console.log("Google OAuth 처리 성공:", response);
        return response;
    } catch (error) {
        console.error("Google OAuth 처리 실패:", error);
        throw error;
    }
}

// 기존 함수들 유지
export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            if (response.token) {
                localStorage.setItem("ACCESS_TOKEN", response.token);
                window.location.href = "/main";
            }
        });
}

export function signout() {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_INFO");
    window.location.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}