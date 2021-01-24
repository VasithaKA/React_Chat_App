import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Form, InputGroup, Navbar } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

const moment = window.moment;

export default function OpenConversation() {
    const [text, settext] = useState('')
    const formInputRef = useRef()
    const lastMessageRef = useCallback(node => {
        if (node) node.scrollIntoView({ smooth: true })
    }, [])
    const { getMessages, sendMessage, selectedConversationDetails } = useConversations()
    const dateFormats = {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[last] dddd',
        sameElse: 'DD MMMM YYYY'
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (text) {
            sendMessage(text, moment().format())
        }
        settext('')
    }

    useEffect(() => {
        settext('')
        formInputRef.current.focus()
    }, [selectedConversationDetails, getMessages])

    return (
        <div className="d-flex flex-column flex-grow-1">
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand>
                    {/* <img
                        alt="profile picture"
                        src="https://react-bootstrap.netlify.app/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '} */}
                    {selectedConversationDetails.name}
                    {getMessages && getMessages.isOnline && <span className="small ml-2">online</span>}
                </Navbar.Brand>
                {/* <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <i className="fa fa-pencil-square-o text-white" aria-hidden="true"></i>
                    </Navbar.Text>
                </Navbar.Collapse> */}
            </Navbar>
            <div className="flex-grow-1 overflow-auto m-2">
                <div className="flex-grow-1 px-3">
                    {getMessages && getMessages.messages.map((message, index) => {
                        let isSameDate = false
                        if (index === 0) isSameDate = true
                        else if (moment(message.sentDate).format('l') !== moment(getMessages.messages[index - 1].sentDate).format('l')) isSameDate = true
                        return (
                            <div key={index} className="my-2 d-flex flex-column align-items-start justify-content-end">
                                {isSameDate && <div className="my-1 px-1 text-muted small align-self-center border rounded bg-light">
                                    {moment(message.sentDate).calendar(dateFormats)}
                                </div>}
                                <div
                                    ref={getMessages.messages.length - 1 === index ? lastMessageRef : null}
                                    className={`d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
                                >
                                    <div className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white' : 'border'}`}>
                                        {!message.fromMe && <div className="text-muted small">{message.senderName}</div>}
                                        <div>{message.content}</div>
                                    </div>
                                    <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>{moment(message.sentDate).format('LT')}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="m-2">
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            required
                            ref={formInputRef}
                            value={text}
                            placeholder="Type a message"
                            onChange={e => settext(e.target.value)}
                            style={{ height: '75px', resize: 'none' }}
                        />
                        <InputGroup.Append>
                            <Button type="submit">Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    )
}
