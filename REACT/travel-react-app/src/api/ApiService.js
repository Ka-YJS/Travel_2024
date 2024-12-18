import axios from 'axios'
import { API_BASE_URL } from '../api/api-config'

export async function call(api, method, request, user, customHeaders = null) {
    // 기본 헤더 설정
    let headers = {
        "Content-Type": "application/json"
    };

    // 커스텀 헤더가 있으면 추가
    if (customHeaders) {
        headers = { ...headers, ...customHeaders };
    }
    // 토큰이 있으면 Authorization 헤더 추가
    else if (user && user.token) {
        headers["Authorization"] = "Bearer " + user.token;
    }

    // OAuth 관련 요청인 경우 특별 처리
    const isOAuthRequest = api.includes('/oauth2/') || api.includes('/login/oauth2/');
    if (isOAuthRequest) {
        headers["Accept"] = "application/json";
        headers["Content-Type"] = "application/json";  // OAuth 요청도 JSON으로 통일
    }

    // 기본 옵션 설정
    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
        withCredentials: true // CORS 인증 요청을 위해 필요
    };

    // GET이 아닌 요청이고 데이터가 있는 경우
    if (method.toUpperCase() !== 'GET' && request) {
        options.data = JSON.stringify(request);  // 모든 요청을 JSON 형식으로 통일
    }

    try {
        const response = await axios(options);
        
        // OAuth 로그인 성공 시 토큰 처리
        if (isOAuthRequest && response.data.token) {
            localStorage.setItem("ACCESS_TOKEN", response.data.token);
            window.location.href = "/main";
            return response.data;
        }
        
        return response.data;
    } catch (error) {
        console.error('API 호출 중 오류 발생:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 403) {
            window.location.href = "/login";
        }

        throw error.response?.data || {
            message: error.message,
            status: error.response?.status || 500
        };
    }
}

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
    window.location.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}