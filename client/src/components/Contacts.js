import React, { useState } from 'react'
import { ListGroup, Modal } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'
import uuidHashing from '../utils/uuidHashing'
import ContactModal from './ContactModal'

export default function Contacts({ myId, meKnownAs, myEmail }) {
    const { setselectedConversationDetails } = useConversations()
    const { contacts } = useContacts()
    const [userDetails, setuserDetails] = useState({ openModal: false, id: '', email: '', name: '' })

    function goToPersonalConversation({ id, email, name, knownAs, isOnline }) {
        setselectedConversationDetails({ conversationId: uuidHashing(myId, id), conversationName: name, isPersonalChat: true, isOnline, members: [{ _id: id, email, knownAs }, { _id: myId, knownAs: meKnownAs, email: myEmail }] })
    }

    function editPersonDetails(contactDetails) {
        setuserDetails({ openModal: true, ...contactDetails })
    }

    function closeModal() {
        setuserDetails({ openModal: false })
    }

    return (
        <>
            <ListGroup variant="flush">
                {contacts.map(contact => (
                    <ListGroup.Item key={contact.id} className="position-relative" variant="flush">
                        <div style={{ cursor: 'pointer' }} onClick={() => goToPersonalConversation(contact)}>
                            {contact.name}
                            {contact.isOnline && <i className="fa fa-circle ml-2 text-success border border-secondary rounded-circle" style={{ fontSize: '.7em' }} aria-hidden="true" />}
                        </div>
                        <span className="position-absolute rounded-circle" style={{
                            padding: '.05em .3em', background: 'rgb(220, 220, 220)',
                            top: '50%', transform: 'translateY(-50%)',
                            right: '5%', cursor: 'pointer'
                        }} onClick={() => editPersonDetails(contact)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={userDetails.openModal} onHide={closeModal} >
                <ContactModal closeModal={closeModal} editContact={userDetails} />
            </Modal>
        </>
    )
}
