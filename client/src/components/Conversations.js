import React, { useCallback } from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

const moment = window.moment;

export default function Conversations() {
    const { conversationsDetails, selectedConversationDetails, setselectedConversationDetails, setUnreadCountToZero } = useConversations()
    const lastMessageRef = useCallback(conversationId => {
        if (conversationId) var timeOutFunc = setTimeout(() => setUnreadCountToZero(conversationId), 0)
        return () => clearTimeout(timeOutFunc)
    }, [setUnreadCountToZero])

    return (
        <ListGroup variant="flush">
            {conversationsDetails.map(conversation => (
                <ListGroup.Item
                    ref={selectedConversationDetails.id === conversation.conversationId && conversation.unreadCount > 0 ? lastMessageRef(conversation.conversationId) : null}
                    key={conversation.conversationId}
                    onClick={() => setselectedConversationDetails({ id: conversation.conversationId, name: conversation.conversationName, members: conversation.members, isPersonalChat: conversation.isPersonalChat })}
                    active={selectedConversationDetails.id === conversation.conversationId}
                    style={{ cursor: 'pointer' }}
                >
                    {conversation.conversationName}
                    {selectedConversationDetails.id !== conversation.conversationId && conversation.unreadCount > 0 && <Badge className="float-right" pill variant="warning" style={{ padding: '.4em .65em' }}>{conversation.unreadCount}</Badge>}
                    <div className={`text-right small ${selectedConversationDetails.id === conversation.conversationId ? 'text-white' : 'text-muted '}`}>{moment(conversation.lastUpdatedTime).format('LT')}</div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}
