export default function Home() {
    return (
        <div className='hero is-fullheight-with-navbar is-primary'>
            <div className='hero-body'>
                <div className='container'>
                    <h1 className='title is-1'>Leasik</h1>
                    <p className='subtitle'>Learn languages in context</p>
                </div>
            </div>

            <footer className='hero-footer'>
                <div className='container py-6'>
                    <p className='is-size-5 has-text-weight-light is-family-monospace'>
                        Created by {' '}
                        <a
                            className='is-underlined'
                            href='https://github.com/abhi-kr-2100/'
                            target='_blank'
                            rel='noreferrer'
                        >
                            abhi-kr-2100
                        </a>.
                    </p>
                </div>
            </footer>
        </div>
    )
}
