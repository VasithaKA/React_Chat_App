import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext()

export const useContacts = () => useContext(ContactsContext)

export function ContactsProvider({ children }) {
    const [contacts, setcontacts] = useLocalStorage('contacts', [])

    function createContact(id, name) {
        setcontacts(prevContacts => [...prevContacts, { id, name }])
    }

    return (
        <ContactsContext.Provider value={{ contacts, createContact }}>
            {children}
        </ContactsContext.Provider>
    )
}
