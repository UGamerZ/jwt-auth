import $api from "../requests";
import type {IUser} from "../types/user.ts";

export default class User {
    static async getUsers() {
        return $api.get<IUser[]>('/users');
    }
}