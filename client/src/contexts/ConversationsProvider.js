import React, { useContext, useEffect, useState, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ConversationsContext = React.createContext()

export const useConversations = () => useContext(ConversationsContext)

export function ConversationsProvider({ myId, children }) {
    const [conversations, setconversations] = useLocalStorage('conversations', [])
    const [selectedConversationId, setselectedConversationId] = useState()
    const { contacts } = useContacts()
    const { socket } = useSocket()

    const addNewConversation = useCallback(({ conversationId, conversationName, members, createDateTime }) => {
        setconversations(prevConversations => [...prevConversations, { conversationId, conversationName, lastUpdateTime: createDateTime, members, unreadCount: 0, messages: [] }])
    }, [setconversations])

    const addMessageToConversation = useCallback(({ senderId, content, sentDate, conversationId, conversationName, members, isRead = true }) => {
        setconversations(prevConversations => {
            let isOldConversation = false
            const newConversations = prevConversations.map(conversation => {
                if (conversation.conversationId === conversationId) {
                    isOldConversation = true
                    return { ...conversation, lastUpdateTime: sentDate, unreadCount: isRead ? 0 : conversation.unreadCount++, messages: [...conversation.messages, { senderId, content, sentDate }] }
                }
                return conversation
            })
            if (!isOldConversation) {
                console.log("NEW CONVERSATION TO STACK, ID:", conversationId);
                return [...prevConversations, { conversationId, conversationName, lastUpdateTime: sentDate, members, messages: [{ senderId, content, sentDate }] }]
            } else return newConversations
        })
    }, [setconversations])

    const setUnreadCountToZero = useCallback(conversationId => {
        console.log("settozerooo");
        setconversations(prevConversations => {
            const newConversations = prevConversations.map(conversation => {
                if (conversation.conversationId === conversationId) {
                    return { ...conversation, unreadCount: 0 }
                }
                return conversation
            })
            return newConversations
        })
    }, [setconversations])

    useEffect(() => {
        console.log("socket")
        if (socket == null) return
        socket.on('receive-message', addMessageToConversation)
        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])

    useEffect(() => {
        if (socket == null) return
        socket.on('receive-conversation-details', addNewConversation)
        return () => socket.off('receive-conversation-details')
    }, [socket, addNewConversation])

    function sendMessage(content, sentDate, conversationId, conversationName, members) {
        socket.emit('send-message', { content, sentDate, conversationId, conversationName, members })
        addMessageToConversation({ senderId: myId, content, sentDate, conversationId })
    }

    function createConversation(conversationId, conversationName, members, createDateTime) {
        members.push(myId)
        socket.emit('create-conversation', { conversationId, conversationName, members, createDateTime })
        addNewConversation({ conversationId, conversationName, members, createDateTime })
    }

    let getSelectedConversationDetails
    let getUnreadConversationCount = 0

    const getConversatonsDetails = conversations.map(conversation => {
        let isSelectedConversation = false
        if (conversation.conversationId === selectedConversationId) {
            const messages = conversation.messages.map(message => {
                const contact = contacts.find(contact => contact.id === message.senderId)
                const senderName = (contact && contact.name) || message.senderId
                const fromMe = myId === message.senderId
                return { ...message, senderName, fromMe }
            })
            isSelectedConversation = true
            getSelectedConversationDetails = { ...conversation, messages }
        }
        if (conversation.unreadCount > 0 && !isSelectedConversation) getUnreadConversationCount++
        return { conversationId: conversation.conversationId, conversationName: conversation.conversationName, lastUpdateTime: conversation.lastUpdateTime, unreadCount: conversation.unreadCount }
    }).sort((a, b) => new Date(b.lastUpdateTime) - new Date(a.lastUpdateTime))

    const value = {
        conversationsDetails: getConversatonsDetails,
        selectedConversationId,
        setselectedConversationId,
        getMessages: getSelectedConversationDetails,
        getUnreadConversationCount,
        sendMessage,
        createConversation,
        setUnreadCountToZero
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}
