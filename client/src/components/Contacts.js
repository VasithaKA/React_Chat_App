import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'
import uuidHashing from '../utils/uuidHashing'

export default function Contacts({ myId }) {
    const { setselectedConversationDetails } = useConversations()
    const { contacts } = useContacts()

    function goToPersonalConversation(contactDetails) {
        setselectedConversationDetails({ id: uuidHashing(myId, contactDetails.id), name: contactDetails.name, isPersonalChat: true, members: [contactDetails.id, myId] })
    }

    function editPersonDetails(userDetails) {
        console.log(userDetails);
    }

    return (
        <ListGroup variant="flush">
            {contacts.map(contact => (
                <ListGroup.Item key={contact.id} className="position-relative" variant="flush">
                    <div style={{ cursor: 'pointer' }} onClick={() => goToPersonalConversation(contact)}>
                        {contact.name}
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
    )
}
