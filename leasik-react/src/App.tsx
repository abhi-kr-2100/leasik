import { Component, ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import Home from './routes/Home'


export default class App extends Component {
    render(): ReactNode {
        return (
            <div>
                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/lists">Lists</NavLink>
                </nav>
                
                <Outlet />
            </div>
        )
    }
}
