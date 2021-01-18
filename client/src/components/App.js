import React from "react";
import { ContactsProvider } from "../contexts/ContactsProvider";
import { ConversationsProvider } from "../contexts/ConversationsProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  const [myId, setmyId] = useLocalStorage('myId')
  const dashboard = (
    <SocketProvider clientId={myId}>
      <ContactsProvider>
        <ConversationsProvider myId={myId}>
          <Dashboard myId={myId} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )

  return (
    myId ? dashboard : <Login onIdSubmit={setmyId} />
  )
}

export default App;
