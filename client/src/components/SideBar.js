import React, { useEffect, useState } from 'react'
import { Badge, Button, Modal, Nav, Navbar, Tab } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import Contacts from './Contacts'
import Conversations from './Conversations'
import ContactModal from './ContactModal'
import GroupModal from './GroupModal'

const CONVERSATIONS_KEY = 'conversations'
const CONTACTS_KEY = 'contacts'

export default function SideBar({ myId, knownAs, email, selectedConv, isSmallScreen, onLogout }) {
    const [activeKey, setactiveKey] = useState(CONVERSATIONS_KEY)
    const [openModal, setopenModal] = useState(false)
    const { getUnreadConversationCount } = useConversations()
    const isConversationOpen = activeKey === CONVERSATIONS_KEY

    function closeModal() {
        setopenModal(false)
    }

    useEffect(() => {
        if (isSmallScreen) {
            if (!selectedConv.conversationId) document.getElementById("sidebar").style.width = "270px"
            else {
                document.getElementById("sidebar").style.width = "0"
                document.getElementById("conversationLayer").style.marginLeft = "0";
            }
        }
    }, [selectedConv, isSmallScreen])

    function logout() {
        console.log("logout");
        onLogout("")
        localStorage.clear()
    }

    return (
        <div id="sidebar" className="d-flex flex-column">
            <Navbar className="navMain">
                <Navbar.Brand style={{ fontSize: "1.15rem", lineHeight: "1.85rem" }}>
                    Hi... <span style={{ fontWeight: "600" }}>{knownAs}</span>
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text><span className="loginToggle logOut" onClick={() => logout()}>Log Out</span></Navbar.Text>
                    {/* <Navbar.Text>
                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </Navbar.Text> */}
                </Navbar.Collapse>
            </Navbar>
            <Tab.Container activeKey={activeKey} onSelect={setactiveKey}>
                <Nav variant="tabs" className="justify-content-center" style={{ width: '270px' }}>
                    <Nav.Item style={{ width: '63%' }}>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>
                            Conversations
                            {getUnreadConversationCount > 0 && <Badge className="ml-1" pill variant="warning" style={{ padding: '.4em .65em' }}>{getUnreadConversationCount}</Badge>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{ width: '37%' }}>
                        <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="border-right overflow-auto flex-grow-1" style={{ width: '270px' }}>
                    <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey={CONTACTS_KEY}>
                        <Contacts myId={myId} meKnownAs={knownAs} myEmail={email} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
            {/* <div className="p-2 border-top border-right small">
                Your Id: <span className="text-muted">{myId}</span>
            </div> */}
            <Button onClick={() => setopenModal(true)} className="rounded-0" style={{ background: "-webkit-linear-gradient(right, #7579ff, #b224ef)", width: '270px' }}>New {isConversationOpen ? 'Group' : 'Contact'}</Button>

            <Modal show={openModal} onHide={closeModal}>
                {isConversationOpen ? <GroupModal closeModal={closeModal} /> : <ContactModal closeModal={closeModal} />}
            </Modal>
        </div>
    )
}
