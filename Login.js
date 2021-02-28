import { Button } from '@material-ui/core'
import React from 'react'
import { login } from './features/userSlice'
import { auth, provider } from './firebase'
import './Login.css'
import {useDispatch} from 'react-redux'

function Login() {
    const dispatch = useDispatch();
    const signIn = () => {
        auth.signInWithPopup(provider)
        .then (({ user }) => {
            dispatch(login({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            }))
        })
        .catch(error => alert(error.message));
    }
    return (
        <div className='login'>
          
            <div className='login__container'>
                <img alt='vijay' src='https://logos.textgiraffe.com/logos/logo-name/Sarita-designstyle-popstar-m.png' />
                <Button variant='contained' color='pink' onClick={signIn} className='login__button'>Login</Button>
            </div>
        </div>
    )
}

export default Login
