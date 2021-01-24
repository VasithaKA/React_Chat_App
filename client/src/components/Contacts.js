import React, { useState } from 'react'
import { ListGroup, Modal } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'
import uuidHashing from '../utils/uuidHashing'
import ContactModal from './ContactModal'

export default function Contacts({ myId }) {
    const { setselectedConversationDetails } = useConversations()
    const { contacts } = useContacts()
    const [userDetails, setuserDetails] = useState({ openModal: false, id: '', name: '' })

    function goToPersonalConversation(contactDetails) {
        setselectedConversationDetails({ id: uuidHashing(myId, contactDetails.id), name: contactDetails.name, isPersonalChat: true, members: [contactDetails.id, myId] })
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
                            <i className={`fa fa-circle ml-2 ${contact.isOnline ? 'text-success' : 'text-danger'}`} style={{ fontSize: '.7em' }} aria-hidden="true" />
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
