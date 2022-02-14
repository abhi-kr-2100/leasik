import axios from 'axios'
import { Component, FormEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { setToken } from '../authentication/utils'


export default function Login(props: { successURL: string }) {
    const navigate = useNavigate()

    return <LoginCls navigate={ navigate } successURL={ props.successURL } />
}


type LoginPropsType = {
    navigate: (path: string) => void
    successURL: string
}

type LoginStateType = {
    username: string
    password: string
}

class LoginCls extends Component<LoginPropsType, LoginStateType> {
    state = {
        username: '',
        password: ''
    }

    async handleSubmit(e: FormEvent<EventTarget>): Promise<void> {
        e.preventDefault()
        const token = await loginUser(this.state)
        if ('error' in token) {
            alert("Login failed. Please make sure your credentials are correct or try again later.")
        } else {
            setToken(token.token)
            this.props.navigate(this.props.successURL)
        }
    }

    render(): ReactNode {
        return (
            <form>
                <label>
                    <p>Username</p>
                    <input onChange={ e => this.setState({ username: e.target.value }) } />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={ e => this.setState({ password: e.target.value }) } />
                </label>

                <div>
                    <button type='submit' onClick={ e => this.handleSubmit(e) }>Submit</button>
                </div>
            </form>
        )
    }
}

async function loginUser(credentials: { username: string, password: string }): Promise<{ token: string } | { error: string }> {
    const loginURL = 'http://127.0.0.1:8000/api/v1/api-token-auth/'

    return axios.post(loginURL, {
        username: credentials.username,
        password: credentials.password
    })
        .then(resp => resp.data)
        .catch(reason => { return { error: reason } })
}
