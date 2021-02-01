import React, { useRef, useState } from 'react'
import { Button, Container, Form, Image } from 'react-bootstrap'
import logo from '../assets/chatapp-logo.png';

const API = '/api/users/'

export default function Login({ onAuthSubmit }) {
    const emailRef = useRef()
    const nameRef = useRef()
    const passwordRef = useRef()
    const cPasswordRef = useRef()
    const [isSignIn, setisSignIn] = useState(true)
    const stateAsText = isSignIn ? 'SIGN IN' : 'SIGN UP'

    function handleSubmit(e) {
        e.preventDefault()
        const email = emailRef.current?.value
        const password = passwordRef.current?.value
        const knownAs = nameRef.current?.value
        const cPassword = cPasswordRef.current?.value
        if (!isSignIn && (password !== cPassword)) {
            return
        }
        let data = ''
        if (isSignIn && email && password) {
            data = { email, password }
        } else if (!isSignIn && email && password && knownAs) {
            data = { email, password, knownAs }
        } else return
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        const URL = `${API}${isSignIn ? 'signin' : 'signup'}`
        fetch(URL, requestOptions).then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            onAuthSubmit(data)
        }).catch(error => {
            console.error('There was an error!', error);
        })
    }

    return (
        <Container className="align-items-center justify-content-center d-flex" style={{ height: '100vh' }}>
            <div className='p-5 rounded text-light loginCard'>
                <Image src={logo} className="mx-auto d-block mb-3" height='70' />
                <h2 className="text-center mb-4">{stateAsText}</h2>
                <Form onSubmit={handleSubmit} className="w-100">
                    {!isSignIn && <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required className="loginInput" placeholder="Enter your name*" />
                        <div className="small">This is not your username. This name will be visible to your contacts.</div>
                    </Form.Group>}
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" ref={emailRef} required className="loginInput" placeholder="Enter email eddress*" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required className="loginInput" placeholder="Enter password*" minLength="4" />
                    </Form.Group>
                    {!isSignIn && <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={cPasswordRef} required className="loginInput" placeholder="Reenter password*" minLength="4" />
                    </Form.Group>}
                    <Button type="submit" className="mx-auto d-block mt-4" variant="light" style={{ borderRadius: '25px' }}>{stateAsText}</Button>
                </Form>
                <div className="mt-4 small text-right">
                    {isSignIn ? "DON'T" : 'ALREADY'} HAVE AN ACCOUNT? <span className="loginToggle ml-1" onClick={() => setisSignIn(prevIsSignIn => !prevIsSignIn)}>{isSignIn ? 'SIGN UP' : 'SIGN IN'}</span>
                </div>
            </div>
        </Container>
    )
}
