import React, { useContext, useEffect, useState, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ConversationsContext = React.createContext()

const API = '/api/conversations'

export const useConversations = () => useContext(ConversationsContext)

export function ConversationsProvider({ myId, token, knownAs, email, children }) {
    const [conversations, setconversations] = useLocalStorage('conversations', [])
    const [selectedConversationDetails, setselectedConversationDetails] = useState({ conversationId: '', conversationName: 'Group Name', isPersonalChat: false, members: [] })
    const { contacts } = useContacts()
    const { socket } = useSocket()

    const addNewGroupConversation = useCallback(({ conversationId, conversationName, members, createdDateTime }) => {
        setconversations(prevConversations => [...prevConversations, { conversationId, conversationName, lastUpdatedTime: createdDateTime, isPersonalChat: false, members, unreadCount: 0, messages: [] }])
    }, [setconversations])

    const addMessageToConversation = useCallback(({ senderId, content, sentDate, conversationId, conversationName, members, isRead = true, isPersonalChat = false }) => {
        setconversations(prevConversations => {
            let isOldConversation = false
            const newConversations = prevConversations.map(conversation => {
                if (conversation.conversationId === conversationId) {
                    let count = conversation.unreadCount;
                    isOldConversation = true
                    return { ...conversation, lastUpdatedTime: sentDate, unreadCount: (isRead ? 0 : count += 1), messages: [...conversation.messages, { senderId, content, sentDate }] }
                }
                return conversation
            })
            if (!isOldConversation && isPersonalChat) {
                console.log("NEW PRIVATE CONVERSATION TO STACK, ID:", conversationId);
                return [...prevConversations, { conversationId, isPersonalChat, lastUpdatedTime: sentDate, members, unreadCount: (isRead ? 0 : 1), messages: [{ senderId, content, sentDate }] }]
            } else if (!isOldConversation && !isPersonalChat) {
                console.log("NEW GROUP CONVERSATION TO STACK, ID:", conversationId);
                return [...prevConversations, { conversationId, conversationName, lastUpdatedTime: sentDate, members, isPersonalChat, unreadCount: (isRead ? 0 : 1), messages: [{ senderId, content, sentDate }] }]
            } else return newConversations
        })
    }, [setconversations])

    const setUnreadCountToZero = useCallback(conversationId => {
        console.log("settozerooo");
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ conversationId })
        };
        fetch(API, requestOptions).then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            setconversations(prevConversations => {
                const newConversations = prevConversations.map(conversation => {
                    if (conversation.conversationId === conversationId) {
                        return { ...conversation, unreadCount: 0 }
                    }
                    return conversation
                })
                return newConversations
            })
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }, [token, setconversations])

    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        console.log('Test API...................');
        const headers = { 'Authorization': 'Bearer ' + token }
        fetch(API, { headers }).then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            setconversations(data)
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }, [token, setconversations]);

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
        const { conversationId, conversationName, isPersonalChat, members } = selectedConversationDetails
        socket.emit('send-message', { content, sentDate, conversationId, conversationName, isPersonalChat, members })
        addMessageToConversation({ senderId: { _id: myId }, content, sentDate, conversationId, isPersonalChat, members })
    }

    function createGroupConversation(conversationId, conversationName, members, createdDateTime) {
        members.push({ _id: myId, email, knownAs })
        socket.emit('create-conversation', { conversationId, conversationName, members, createdDateTime })
        addNewGroupConversation({ conversationId, conversationName, members, createdDateTime })
    }

    let getSelectedConversationDetails
    let getUnreadConversationCount = 0

    const getConversatonsDetails = conversations.map(conversation => {
        const isSelectedConversation = conversation.conversationId === selectedConversationDetails.conversationId
        if (isSelectedConversation) {
            const messages = conversation.messages.map(message => {
                const contact = contacts.find(contact => contact.id === message.senderId._id)
                const senderName = (contact && contact.name) || '~' + message.senderId.knownAs
                const fromMe = myId === message.senderId._id
                return { ...message, senderName, fromMe }
            })
            getSelectedConversationDetails = { ...conversation, messages }
        }
        if (conversation.isPersonalChat) {
            const memberId = conversation.members.find(member => member._id !== myId)
            const contact = contacts.find(contact => contact.id === memberId._id)
            var personalChatName = (contact && contact.name) || memberId.email
            if (isSelectedConversation) {
                const isOnline = (contact && contact.isOnline) || ''
                getSelectedConversationDetails = { ...getSelectedConversationDetails, isOnline }
            }
        }
        //if selected conversation, name update
        if (isSelectedConversation && conversation.isPersonalChat && selectedConversationDetails.conversationName !== personalChatName) {
            setselectedConversationDetails(prevState => ({ ...prevState, conversationName: personalChatName }))
        }
        if (conversation.unreadCount > 0 && !isSelectedConversation) getUnreadConversationCount++
        return { conversationId: conversation.conversationId, conversationName: conversation.conversationName || personalChatName, isPersonalChat: conversation.isPersonalChat, members: conversation.members, lastUpdatedTime: conversation.lastUpdatedTime, unreadCount: conversation.unreadCount }
    }).sort((a, b) => new Date(b.lastUpdatedTime) - new Date(a.lastUpdatedTime))

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
