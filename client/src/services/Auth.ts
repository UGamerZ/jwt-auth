import $api from "../requests";
import type {AuthResponse} from "../types/response/auth.ts";

export default class Auth {
    static async login() {
        return $api.post<AuthResponse>(
            '/login',
            document.querySelector('#login-form'),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    static async register() {
        return $api.post<AuthResponse>(
            '/register',
            document.querySelector('#register-form'),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    static async logout() {
        return $api.post('/logout');
    }
}