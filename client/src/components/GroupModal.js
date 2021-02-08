import React, { useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
import { useConversations } from '../contexts/ConversationsProvider';
import { v4 as uuidV4 } from 'uuid';

const moment = window.moment;

export default function GroupModal({ closeModal }) {
    const [selectedContacts, setselectedContacts] = useState([])
    const groupNameRef = useRef()
    const { contacts } = useContacts()
    const { createGroupConversation } = useConversations()

    function handleSubmit(e) {
        e.preventDefault()
        const groupName = groupNameRef.current.value ? groupNameRef.current.value : 'New Group'
        if (selectedContacts.length > 0) createGroupConversation(uuidV4(), groupName, selectedContacts, moment().format())
        closeModal()
    }

    function handleCheckboxChange(e) {
        const [isChecked, contactId] = [e.target.checked, e.target.value]
        const { id, email, knownAs } = contacts.find(e => e.id === contactId)
        setselectedContacts(prevSelectedContacts => {
            const isNotInPrev = !prevSelectedContacts.find(e => e._id === id)
            if (isNotInPrev && isChecked) {
                return [...prevSelectedContacts, { _id: id, email, knownAs }]
            } else if (!isNotInPrev && !isChecked) {
                return prevSelectedContacts.filter(e => e._id !== contactId)
            }
        })
    }

    return (
        <>
            <Modal.Header closeButton>Creat a New Group</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control className="loginInput" type="text" ref={groupNameRef} placeholder="Group Name" />
                    </Form.Group>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={contact.id}
                                label={contact.name}
                                onChange={e => handleCheckboxChange(e)}
                            />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create Group</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
