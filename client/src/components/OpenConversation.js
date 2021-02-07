import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Form, InputGroup, Navbar } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

const moment = window.moment;

export default function OpenConversation({ isSmallScreen }) {
    const [text, settext] = useState('')
    const [openSidebar, setopenSidebar] = useState(false)
    const formInputRef = useRef()
    const lastMessageRef = useCallback(node => {
        if (node) node.scrollIntoView({ smooth: true })
    }, [])
    const { getMessages, sendMessage, selectedConversationDetails, setUnreadCountToZero, getUnreadConversationCount } = useConversations()
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
    }, [selectedConversationDetails.conversationId])

    useEffect(() => {
        if (getMessages.unreadCount > 0) {
            setUnreadCountToZero(getMessages.conversationId)
        }
    }, [getMessages, setUnreadCountToZero])

    useEffect(() => {
        setopenSidebar(false)
        formInputRef.current.focus()
        if (!isSmallScreen) {
            document.getElementById("sidebar").style.width = "270px";
            document.getElementById("conversationLayer").style.marginLeft = "0";
        }
    }, [isSmallScreen, selectedConversationDetails])

    function sidebarToggler(toggle) {
        setopenSidebar(prev => !prev)
        if (toggle) {
            document.getElementById("sidebar").style.width = "270px";
            document.getElementById("conversationLayer").style.marginLeft = "270px";
        } else {
            formInputRef.current.focus()
            document.getElementById("sidebar").style.width = "0";
            document.getElementById("conversationLayer").style.marginLeft = "0";
        }
    }

    return (
        <div id="conversationLayer" className="d-flex flex-column flex-grow-1">
            <Navbar className="navMain">
                <Navbar.Brand>
                    {/* <img
                        alt="profile picture"
                        src="https://react-bootstrap.netlify.app/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '} */}
                    {isSmallScreen && (openSidebar ?
                        <i className="fa fa-times mr-2" aria-hidden="true" onClick={() => sidebarToggler(false)} /> :
                        <i className="fa fa-bars mr-2" aria-hidden="true" onClick={() => sidebarToggler(true)} >{getUnreadConversationCount > 0 && <i className="fa fa-circle text-warning" aria-hidden="true" />}</i>
                    )}
                    <span style={{ fontWeight: "600" }}>{selectedConversationDetails.conversationName}</span>
                    {getMessages && getMessages.memberKnownAs && <span className="small ml-2">{getMessages.memberKnownAs}</span>}
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
                                {isSameDate && <div className="my-1 px-1 small align-self-center border rounded bg-primary">
                                    {moment(message.sentDate).calendar(dateFormats)}
                                </div>}
                                <div
                                    ref={getMessages.messages.length - 1 === index ? lastMessageRef : null}
                                    className={`d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
                                >
                                    <div className={`rounded px-2 py-1 ${message.fromMe ? 'fromMeChat' : 'fromOtherChat'}`}>
                                        {!message.fromMe && !getMessages.isPersonalChat && <div className="text-body small">{message.senderName}</div>}
                                        <div>{message.content}</div>
                                    </div>
                                    <div className={`text-white-50 small ${message.fromMe ? 'text-right' : ''}`}>{moment(message.sentDate).format('LT')}</div>
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
                            className="chatInput"
                            onChange={e => settext(e.target.value)}
                            style={{ height: '75px', resize: 'none' }}
                        />
                        <InputGroup.Append>
                            <Button type="submit" style={{ background: "-webkit-linear-gradient(top, #7579ff, #b224ef)" }}>Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    )
}
