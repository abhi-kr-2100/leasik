import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getTokenFromCredentials } from '../utilities/apiCalls'
import { setToken } from '../utilities/authentication'


function LoginForm(
    props: {
        setUsername: (arg0: string) => any
        setPassword: (arg0: string) => any
        onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
    }
) {
    const {
        setUsername,
        setPassword,
        onSubmit 
    } = props

    return (
        <form>
            <label>
                <p>Username</p>
                <input onChange={ e => setUsername(e.target.value) } />
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={ e => setPassword(e.target.value) } />
            </label>

            <div>
                <button type='submit' onClick={ e => onSubmit(e) }>Submit</button>
            </div>
        </form>
    )
}


export default function Login(props: { redirectURL: string }) {
    const { redirectURL } = props

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    return (
        <LoginForm
            setUsername={ setUsername }
            setPassword={ setPassword }
            onSubmit={ login }
        />
    )

    async function login(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        
        const token = await getTokenFromCredentials(username, password)

        if ('error' in token) {
            alert("Login failed.")
        } else {
            setToken(token.token)
            navigate(redirectURL)
        }
    }
}
