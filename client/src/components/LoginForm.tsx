import {type FC, useContext} from "react";
import {Context} from "../main.tsx";
import {observer} from "mobx-react-lite";

const LoginForm:FC = () => {
    const {store} = useContext(Context);

    return(
        <form id='login-form' action={() => store.login()}>
            <input
                type='text'
                placeholder='Email'
                name='email'
                required={true}
            />
            <input
                type='text'
                placeholder='Password'
                name='password'
                required={true}
            />
            <button type='submit'>Login</button>
        </form>
    )
}

export default observer(LoginForm);
