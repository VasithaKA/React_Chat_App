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
    const selectedConversationId = selectedConversationDetails.conversationId

    return (
        <ListGroup variant="flush">
            {conversationsDetails.map(conversation => (
                <ListGroup.Item
                    ref={selectedConversationId === conversation.conversationId && conversation.unreadCount > 0 ? lastMessageRef(conversation.conversationId) : null}
                    key={conversation.conversationId}
                    onClick={() => setselectedConversationDetails({ conversationId: conversation.conversationId, conversationName: conversation.conversationName, members: conversation.members, isPersonalChat: conversation.isPersonalChat })}
                    active={selectedConversationId === conversation.conversationId}
                    style={{ cursor: 'pointer' }}
                >
                    {conversation.conversationName}
                    {selectedConversationId !== conversation.conversationId && conversation.unreadCount > 0 && <Badge className="float-right" pill variant="warning" style={{ padding: '.4em .65em' }}>{conversation.unreadCount}</Badge>}
                    <div className={`text-right small ${selectedConversationId === conversation.conversationId ? 'text-white' : 'text-muted '}`}>{moment(conversation.lastUpdatedTime).format('LT')}</div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}
