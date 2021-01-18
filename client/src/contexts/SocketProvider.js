import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()
const SERVERSOCKETURL = 'http://localhost:5000'

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ clientId, children }) {
    const [socket, setsocket] = useState()

    useEffect(() => {
        const newSocket = io(
            SERVERSOCKETURL,
            { query: { clientId } }
        )
        setsocket(newSocket)
        return () => newSocket.close()
    }, [clientId])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}