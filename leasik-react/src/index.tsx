import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'
import Home from './routes/Home'
import Login from './routes/Login'
import SentenceListPlayRouterComponent from './routes/SentenceListPlay'
import SentenceLists from './routes/SentenceLists'


render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={ <App /> }>
                <Route index element={ <Home /> } />
                <Route path='/login' element={ <Login /> } />
                <Route path='/lists' element={ <SentenceLists /> } />
                <Route path='/lists/:listId' element={ <SentenceListPlayRouterComponent /> } />
                <Route path="*" element={
                    <p>404</p>
                } />
            </Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
)
