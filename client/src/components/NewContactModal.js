import React, { useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

export default function NewContactModal({ closeModal }) {
    const idRef = useRef()
    const nameRef = useRef()
    const { createContact } = useContacts()

    function handleSubmit(e) {
        e.preventDefault()
        console.log(idRef.current.value, nameRef.current.value);
        if (idRef.current.value && nameRef.current.value) createContact(idRef.current.value, nameRef.current.value)
        closeModal()
    }

    return (
        <>
            <Modal.Header closeButton>Add a New Contact</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" ref={idRef} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>
                    <Button type="submit">Add Contact</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
