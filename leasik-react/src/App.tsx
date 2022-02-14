import { Component, ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'


export default class App extends Component {
    render(): ReactNode {
        return (
            <div>
                <nav className="navbar is-primary">
                    <div className='navbar-brand is-primary'>
                        <NavLink className='navbar-item' to="/">Home</NavLink>
                        <NavLink className='navbar-item' to="/lists">Lists</NavLink>
                    </div>
                </nav>
                
                <Outlet />
            </div>
        )
    }
}
