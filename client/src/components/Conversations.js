import React from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

const moment = window.moment;

export default function Conversations() {
    const { conversationsDetails, selectedConversationDetails, setselectedConversationDetails } = useConversations()
    const selectedConversationId = selectedConversationDetails.conversationId
    const dateFormats = {
        sameDay: 'LT',
        lastDay: '[Yesterday]',
        lastWeek: '[last] dddd',
        sameElse: 'L'
    }

    function onClickHandler({ conversationId, conversationName, members, isPersonalChat }) {
        setselectedConversationDetails({ conversationId, conversationName, members, isPersonalChat })
    }

    return (
        <ListGroup variant="flush">
            {conversationsDetails.map(conversation => (
                <ListGroup.Item
                    key={conversation.conversationId}
                    onClick={() => onClickHandler(conversation)}
                    active={selectedConversationId === conversation.conversationId}
                    style={{ cursor: 'pointer' }}
                    title={conversation.conversationName}
                >
                    <div style={{ width: '190px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{conversation.conversationName}</div>
                    { selectedConversationId !== conversation.conversationId && conversation.unreadCount > 0 && <Badge className="float-right" pill variant="warning" style={{ padding: '.4em .65em', position: 'absolute', top: '13px', right: '20px' }}>{conversation.unreadCount}</Badge>}
                    <div className={`text-right small ${selectedConversationId === conversation.conversationId ? 'text-white' : 'text-body'}`}>{moment(conversation.lastUpdatedTime).calendar(dateFormats)}</div>
                </ListGroup.Item>
            ))
            }
        </ListGroup >
    )
}
