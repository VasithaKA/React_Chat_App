import React, { useContext, useEffect, useState, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ConversationsContext = React.createContext()

export const useConversations = () => useContext(ConversationsContext)

export function ConversationsProvider({ myId, children }) {
    const [conversations, setconversations] = useLocalStorage('conversations', [])
    const [selectedConversationDetails, setselectedConversationDetails] = useState({ id: '', name: 'Group Name', isPersonalChat: false, members: [] })
    const { contacts } = useContacts()
    const { socket } = useSocket()

    const addNewGroupConversation = useCallback(({ conversationId, conversationName, members, createDateTime }) => {
        setconversations(prevConversations => [...prevConversations, { conversationId, conversationName, lastUpdateTime: createDateTime, isPersonalChat: false, members, unreadCount: 0, messages: [] }])
    }, [setconversations])

    const addMessageToConversation = useCallback(({ senderId, content, sentDate, conversationId, conversationName, members, isRead = true, isPersonalChat = false }) => {
        setconversations(prevConversations => {
            let isOldConversation = false
            const newConversations = prevConversations.map(conversation => {
                if (conversation.conversationId === conversationId) {
                    let count = conversation.unreadCount;
                    isOldConversation = true
                    return { ...conversation, lastUpdateTime: sentDate, unreadCount: (isRead ? 0 : count += 1), messages: [...conversation.messages, { senderId, content, sentDate }] }
                }
                return conversation
            })
            if (!isOldConversation && isPersonalChat) {
                console.log("NEW PRIVATE CONVERSATION TO STACK, ID:", conversationId);
                return [...prevConversations, { conversationId, isPersonalChat, lastUpdateTime: sentDate, members, unreadCount: (isRead ? 0 : 1), messages: [{ senderId, content, sentDate }] }]
            } else if (!isOldConversation && !isPersonalChat) {
                console.log("NEW GROUP CONVERSATION TO STACK, ID:", conversationId);
                return [...prevConversations, { conversationId, conversationName, lastUpdateTime: sentDate, members, isPersonalChat, unreadCount: (isRead ? 0 : 1), messages: [{ senderId, content, sentDate }] }]
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
        socket.on('receive-conversation-details', addNewGroupConversation)
        return () => socket.off('receive-conversation-details')
    }, [socket, addNewGroupConversation])

    function sendMessage(content, sentDate) {
        const [conversationId, conversationName, isPersonalChat, members] = [selectedConversationDetails.id, selectedConversationDetails.name, selectedConversationDetails.isPersonalChat, selectedConversationDetails.members]
        socket.emit('send-message', { content, sentDate, conversationId, conversationName, isPersonalChat, members })
        addMessageToConversation({ senderId: myId, content, sentDate, conversationId, isPersonalChat, members })
    }

    function createGroupConversation(conversationId, conversationName, members, createDateTime) {
        members.push(myId)
        socket.emit('create-conversation', { conversationId, conversationName, members, createDateTime })
        addNewGroupConversation({ conversationId, conversationName, members, createDateTime })
    }

    let getSelectedConversationDetails
    let getUnreadConversationCount = 0

    const getConversatonsDetails = conversations.map(conversation => {
        const isSelectedConversation = conversation.conversationId === selectedConversationDetails.id
        if (isSelectedConversation) {
            const messages = conversation.messages.map(message => {
                const contact = contacts.find(contact => contact.id === message.senderId)
                const senderName = (contact && contact.name) || message.senderId
                const fromMe = myId === message.senderId
                return { ...message, senderName, fromMe }
            })
            getSelectedConversationDetails = { ...conversation, messages }
        }
        if (conversation.isPersonalChat) {
            const memberId = conversation.members.find(id => id !== myId)
            const contact = contacts.find(contact => contact.id === memberId)
            var personalChatName = (contact && contact.name) || memberId
            if (isSelectedConversation) {
                const isOnline = (contact && contact.isOnline) || ''
                getSelectedConversationDetails = { ...getSelectedConversationDetails, isOnline }
            }
        }
        if (conversation.unreadCount > 0 && !isSelectedConversation) getUnreadConversationCount++
        return { conversationId: conversation.conversationId, conversationName: conversation.conversationName || personalChatName, isPersonalChat: conversation.isPersonalChat, members: conversation.members, lastUpdateTime: conversation.lastUpdateTime, unreadCount: conversation.unreadCount }
    }).sort((a, b) => new Date(b.lastUpdateTime) - new Date(a.lastUpdateTime))

    const value = {
        conversationsDetails: getConversatonsDetails,
        selectedConversationDetails,
        setselectedConversationDetails,
        getMessages: getSelectedConversationDetails,
        getUnreadConversationCount,
        sendMessage,
        createGroupConversation,
        setUnreadCountToZero
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}
