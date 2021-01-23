import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext()

export const useContacts = () => useContext(ContactsContext)

export function ContactsProvider({ children }) {
    const [contacts, setcontacts] = useLocalStorage('contacts', [])

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

    contacts.sort((a, b) => {
        const [nameA, nameB] = [a.name.toLowerCase(), b.name.toLowerCase()]
        return (nameA > nameB) ? 1 : ((nameB > nameA) ? -1 : 0)
    })

    return (
        <ContactsContext.Provider value={{ contacts, createContact }}>
            {children}
        </ContactsContext.Provider>
    )
}
