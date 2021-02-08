import React, { useEffect, useState } from 'react'
import { useConversations } from '../contexts/ConversationsProvider'
import OpenConversation from './OpenConversation'
import SideBar from './SideBar'

export default function Dashboard({ myId, knownAs, email, onLogout }) {
    const { selectedConversationDetails } = useConversations()
    const [isSmallScreen, setisSmallScreen] = useState(window.innerWidth <= 768)

    useEffect(() => {
        try {
            window.addEventListener("resize", () => {
                setisSmallScreen(window.innerWidth <= 768)
            }, false)
        } catch (error) {
            console.error("Not support 'error': ", error);
        }
    }, [])

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <SideBar myId={myId} knownAs={knownAs} email={email} selectedConv={selectedConversationDetails} isSmallScreen={isSmallScreen} onLogout={onLogout} />
            {selectedConversationDetails.conversationId && <OpenConversation isSmallScreen={isSmallScreen} />}
        </div>
    )
}
