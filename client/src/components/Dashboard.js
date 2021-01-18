import React from 'react'
import { useConversations } from '../contexts/ConversationsProvider'
import OpenConversation from './OpenConversation'
import SideBar from './SideBar'

export default function Dashboard({ myId }) {
    const { selectedConversationId } = useConversations()
    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <SideBar myId={myId} />
            {selectedConversationId && <OpenConversation />}
        </div>
    )
}
