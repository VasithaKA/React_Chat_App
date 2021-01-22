import React, { useState } from 'react'
import { Badge, Button, Modal, Nav, Tab } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import Contacts from './Contacts'
import Conversations from './Conversations'
import ContactModal from './ContactModal'
import GroupModal from './GroupModal'

const CONVERSATIONS_KEY = 'conversations'
const CONTACTS_KEY = 'contacts'

export default function SideBar({ myId }) {
    const [activeKey, setactiveKey] = useState(CONVERSATIONS_KEY)
    const [openModal, setopenModal] = useState(false)
    const { getUnreadConversationCount } = useConversations()
    const isConversationOpen = activeKey === CONVERSATIONS_KEY

    function closeModal() {
        setopenModal(false)
    }

    return (
        <div style={{ width: '260px' }} className="d-flex flex-column">
            <Tab.Container activeKey={activeKey} onSelect={setactiveKey}>
                <Nav variant="tabs" className="justify-content-center">
                    <Nav.Item style={{ width: '63%' }}>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>
                            Conversations
                            {getUnreadConversationCount > 0 && <Badge className="ml-1" pill variant="warning" style={{ padding: '.4em .65em' }}>{getUnreadConversationCount}</Badge>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="border-right overflow-auto flex-grow-1">
                    <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey={CONTACTS_KEY}>
                        <Contacts myId={myId} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
            <div className="p-2 border-top border-right small">
                Your Id: <span className="text-muted">{myId}</span>
            </div>
            <Button onClick={() => setopenModal(true)} className="rounded-0">New {isConversationOpen ? 'Group' : 'Contact'}</Button>

            <Modal show={openModal} onHide={closeModal}>
                {isConversationOpen ? <GroupModal closeModal={closeModal} /> : <ContactModal closeModal={closeModal} />}
            </Modal>
        </div>
    )
}
