import {type FC, useContext} from "react";
import {Context} from "../main.tsx";
import {observer} from "mobx-react-lite";

const RegisterForm:FC = () => {
    const {store} = useContext(Context);

    return(
        <form id='register-form' action={() => store.register()}>
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
            <button type='submit'>Register</button>
        </form>
    )
}

export default observer(RegisterForm);
