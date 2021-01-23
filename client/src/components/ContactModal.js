import React, { useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

export default function ContactModal({ closeModal, editContact }) {
    const idRef = useRef()
    const nameRef = useRef()
    const { createContact } = useContacts()

    function handleSubmit(e, shouldDeleteContact = false) {
        e.preventDefault()
        const isUpdateContact = editContact && !shouldDeleteContact ? true : false
        if (idRef.current.value && nameRef.current.value) createContact(idRef.current.value, nameRef.current.value, isUpdateContact, shouldDeleteContact)
        closeModal()
    }

    return (
        <>
            <Modal.Header closeButton>Add a New Contact</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" ref={idRef} required disabled={editContact} defaultValue={editContact && editContact.id} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required defaultValue={editContact && editContact.name} />
                    </Form.Group>
                    <Button type="submit">{editContact ? 'Save Changes' : 'Add Contact'}</Button>
                    {editContact && <Button type="button" className="float-right" variant="danger" onClick={e => handleSubmit(e, true)}>Delete Contact</Button>}
                </Form>
            </Modal.Body>
        </>
    )
}
