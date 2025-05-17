import type {IUser} from "../types/user.ts";
import {makeAutoObservable} from "mobx";
import Auth from "../services/Auth.ts";
import type {AuthResponse} from "../types/response/auth.ts";
import {API_URL} from "../requests";
import axios from 'axios';

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login() {
        try {
            const response = await Auth.login();
            localStorage.setItem('token', response.data.access);
            console.log(response);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
        }
    }

    async register() {
        try {
            const response = await Auth.register();
            console.log(response);
            localStorage.setItem('token', response.data.access);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
        }
    }

    async logout() {
        try {
            await Auth.logout();
            this.setAuth(false);
            this.setUser({} as IUser);
            localStorage.removeItem('token');
        } catch (e) {
            console.log(e);
        }
    }

    async checkAuth() {
        this.setIsLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            console.log(response);
            this.setAuth(true);
            this.setUser(response.data.user);
            localStorage.setItem('token', response.data.access);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    }
}