import type {IUser} from "../user.ts";

export interface AuthResponse {
    access: string;
    refresh: string;
    user: IUser;
}