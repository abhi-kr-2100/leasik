import { Component, ReactNode } from 'react'


export default class Home extends Component {
    render(): ReactNode {
        return (
            <div>
                <h1>Leasik</h1>
                <p>Learn languages in context</p>

                <footer>
                    <p>Created by {' '}
                        <a
                            href='https://github.com/abhi-kr-2100/'
                            target='_blank'
                            rel='noreferrer'
                        >
                            abhi-kr-2100
                        </a>.
                    </p>
                </footer>
            </div>
        )
    }
}
