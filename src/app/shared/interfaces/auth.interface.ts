export interface LoginResponse {
    accessToken: string;
}

export interface AccessTokenPayload {
    sub: string;
    login: string;
    exp?: number;
}
