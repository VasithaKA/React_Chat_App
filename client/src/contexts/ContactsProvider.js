import React, { useCallback, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useSocket } from './SocketProvider';

const ContactsContext = React.createContext()

const API = '/api/contacts'

export const useContacts = () => useContext(ContactsContext)

export function ContactsProvider({ token, children }) {
    const [contacts, setcontacts] = useLocalStorage('contacts', [])
    const [onlineContactIds, setonlineContactIds] = useState([])
    const { socket } = useSocket()

    const createContact = useCallback(async ({ id, email, name, isUpdateContact, shouldDeleteContact }) => {
        const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }

        try {
            if (!isUpdateContact && !shouldDeleteContact) {
                const requestOptions = {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ email, name })
                };
                const data = await apiCaller({ requestOptions })
                setcontacts(prevContacts => [...prevContacts, { ...data, email, name }])
            } else if (isUpdateContact && !shouldDeleteContact) {
                const requestOptions = {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ id, name })
                };
                await apiCaller({ requestOptions })
                setcontacts(prevContacts => {
                    const updatedContacts = prevContacts.map(contact => {
                        if (contact.id === id) {
                            return { ...contact, name }
                        } else {
                            return contact
                        }
                    })
                    return updatedContacts
                })
            } else if (!isUpdateContact && shouldDeleteContact) {
                const requestOptions = {
                    method: 'DELETE',
                    headers,
                    body: JSON.stringify({ id })
                };
                await apiCaller({ requestOptions })
                setcontacts(prevContacts => {
                    const updatedContacts = prevContacts.filter(contact => contact.id !== id)
                    return updatedContacts
                })
            }
        } catch (error) {
            console.error("There was an error:", error);
        }
    }, [token, setcontacts])

    useEffect(() => {
        async function fetchData() {
            console.log('Contact API...................');
            const requestOptions = { headers: { 'Authorization': 'Bearer ' + token } }
            try {
                const data = await apiCaller({ requestOptions })
                setcontacts(data)
            } catch (error) {
                console.error("There was an error:", error);
            }
        }
        fetchData()
    }, [token, setcontacts]);

    async function apiCaller({ requestOptions }) {
        return fetch(API, requestOptions).then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data
        })
    }

    const setOnlineContacts = useCallback(({ userId, isGoToOffline = false }) => {
        console.log(userId)
        if (isGoToOffline) {
            setonlineContactIds(onlineContacts => onlineContacts.filter(fId => fId !== userId))
        } else {
            setonlineContactIds(onlineContacts => [...onlineContacts, userId])
        }
    }, [setonlineContactIds])

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
