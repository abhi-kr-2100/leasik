import axios from 'axios'
import { Component, FormEvent, ReactNode } from 'react'

import { setToken } from '../authentication/utils'


export type LoginStateType = {
    username: string
    password: string
}

export default class Login extends Component<{}, LoginStateType> {
    async handleSubmit(e: FormEvent<EventTarget>): Promise<void> {
        e.preventDefault()
        const token = await loginUser(this.state)
        setToken(token.token)
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

export class LoginWrapper extends Component {
    render(): ReactNode {
        return (
            <div>
                <h1>Please log in to continue...</h1>
                <Login />
            </div>
        )
    }
}

export async function loginUser(credentials: { username: string, password: string }): Promise<{ token: string }> {
    const loginURL = 'http://127.0.0.1:8000/api/v1/api-token-auth/'

    return axios.post(loginURL, {
        username: credentials.username,
        password: credentials.password
    }).then(resp => resp.data)
}
