import LoginForm from "./components/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm.tsx";
import {useContext, useEffect, useState} from "react";
import {Context} from "./main.tsx";
import {observer} from "mobx-react-lite";
import User from "./services/User.ts";
import type {IUser} from "./types/user.ts";

const App = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>();
    useEffect(() => {
        if(localStorage.getItem('token')) store.checkAuth();
    }, []);

    const getUsers = async () => {
        try{
            const response = await User.getUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if(store.isLoading) return <h1>Loading...</h1>

    if(store.isAuth){
        return (
            <div>
                <h1>Welcome back, {store.user.email}</h1>
                {store.user.emailVerified? <h2>Email confirmed</h2> : <h2>Confirm email please</h2>}
                <button onClick={() => store.logout()}>Log out</button>
                <button onClick={() => getUsers()}>View other users</button>
                {users?.map(user => <li key={user.id}>{user.email}</li>)}
            </div>
        )
    }

    return (
        <div>
            <h1>No login currently</h1>
            <LoginForm/>
            <RegisterForm/>
        </div>
    );
}

export default observer(App);