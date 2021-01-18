import React, { useCallback } from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

const moment = window.moment;

export default function Conversations() {
    const { conversationsDetails, selectedConversationId, setselectedConversationId, setUnreadCountToZero } = useConversations()
    const lastMessageRef = useCallback(conversationId => {
        let timeOutFunc = null
        if (conversationId) timeOutFunc = setTimeout(() => setUnreadCountToZero(conversationId), 0)
        return () => clearTimeout(timeOutFunc)
    }, [setUnreadCountToZero])

    return (
        <ListGroup variant="flush">
            {conversationsDetails.map(conversation => (
                <ListGroup.Item
                    ref={selectedConversationId === conversation.conversationId && conversation.unreadCount > 0 ? lastMessageRef(conversation.conversationId) : null}
                    key={conversation.conversationId}
                    onClick={() => setselectedConversationId(conversation.conversationId)}
                    active={selectedConversationId === conversation.conversationId}
                    style={{ cursor: 'pointer' }}
                >
                    {conversation.conversationName}
                    {selectedConversationId !== conversation.conversationId && conversation.unreadCount > 0 && <Badge className="float-right" pill variant="warning" style={{ padding: '.4em .65em' }}>{conversation.unreadCount}</Badge>}
                    <div className={`text-right small ${selectedConversationId === conversation.conversationId ? 'text-white' : 'text-muted '}`}>{moment(conversation.lastUpdateTime).format('LT')}</div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}
