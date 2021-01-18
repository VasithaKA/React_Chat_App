import React, { useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
import { useConversations } from '../contexts/ConversationsProvider';
import { v4 as uuidV4 } from 'uuid';

const moment = window.moment;

export default function NewGroupModal({ closeModal }) {
    const [selectedContactIds, setselectedContactIds] = useState([])
    const groupNameRef = useRef()
    const { contacts } = useContacts()
    const { createConversation } = useConversations()

    function handleSubmit(e) {
        e.preventDefault()
        const groupName = groupNameRef.current.value ? groupNameRef.current.value : 'New Group'
        if (selectedContactIds.length > 0) createConversation(uuidV4(), groupName, selectedContactIds, moment().format())
        closeModal()
    }

    function handleCheckboxChange(e) {
        const [isChecked, contactId] = [e.target.checked, e.target.value]
        setselectedContactIds(prevSelectedContactIds => {
            if (!prevSelectedContactIds.includes(contactId) && isChecked) {
                return [...prevSelectedContactIds, contactId]
            } else if (prevSelectedContactIds.includes(contactId) && !isChecked) {
                return prevSelectedContactIds.filter(fId => fId !== contactId)
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
                        <Form.Control type="text" ref={groupNameRef} placeholder="Group Name" />
                    </Form.Group>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={contact.id}
                                label={contact.name}
                                onChange={handleCheckboxChange}
                            />
                        </Form.Group>
                    ))}
                    <Button type="submit">Add Contact</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
