import React, { useCallback, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useSocket } from './SocketProvider';

const ContactsContext = React.createContext()

export const useContacts = () => useContext(ContactsContext)

export function ContactsProvider({ children }) {
    const [contacts, setcontacts] = useLocalStorage('contacts', [])
    const [onlineContactIds, setonlineContactIds] = useState([])
    const { socket } = useSocket()

    function createContact(id, name, isUpdateContact, shouldDeleteContact) {
        setcontacts(prevContacts => {
            if (isUpdateContact) {
                const updatedContacts = prevContacts.map(contact => {
                    if (contact.id === id) {
                        return { ...contact, name }
                    } else {
                        return contact
                    }
                })
                return updatedContacts
            } else if (shouldDeleteContact) {
                const updatedContacts = prevContacts.filter(contact => contact.id !== id)
                return updatedContacts
            } else {
                return [...prevContacts, { id, name }]
            }
        })
    }

    const setOnlineContacts = useCallback(({ userId, isGoToOffline = false }) => {
        console.log(userId)
        if (isGoToOffline) {
            setonlineContactIds(onlineContacts => onlineContacts.filter(fId => fId !== userId))
        } else if (!onlineContactIds.includes(userId)) {
            setonlineContactIds(onlineContacts => [...onlineContacts, userId])
        }
    }, [onlineContactIds, setonlineContactIds])

    useEffect(() => {
        console.log('check-others-online');
        if (socket == null) return
        socket.emit('check-others-online', { contactsDetails: contacts })
    }, [socket, contacts])

    useEffect(() => {
        console.log('new-online-user');
        if (socket == null) return
        socket.on('new-online-user', ({ userId }) => {
            if (userId) {
                setOnlineContacts({ userId })
                socket.emit('send-user-online', { contactId: userId })
            }
        })
        return () => socket.off('new-online-user')
    }, [socket, setOnlineContacts])

    useEffect(() => {
        console.log('received online contacts');
        if (socket == null) return
        socket.on('receive-user-online', setOnlineContacts)
        return () => socket.off('receive-user-online')
    }, [socket, setOnlineContacts])

    useEffect(() => {
        console.log('receive-user-offline');
        if (socket == null) return
        socket.on('receive-user-offline', setOnlineContacts)
        return () => socket.off('receive-user-offline')
    }, [socket, setOnlineContacts])

    const getContactList = contacts.map(contact => {
        const isOnline = onlineContactIds.includes(contact.id)
        return { ...contact, isOnline }
    }).sort((a, b) => {
        const [nameA, nameB] = [a.name.toLowerCase(), b.name.toLowerCase()]
        return (nameA > nameB) ? 1 : ((nameB > nameA) ? -1 : 0)
    })

    return (
        <ContactsContext.Provider value={{ contacts: getContactList, createContact }}>
            {children}
        </ContactsContext.Provider>
    )
}
