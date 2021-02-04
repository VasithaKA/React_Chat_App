import React from "react";
import { ContactsProvider } from "../contexts/ContactsProvider";
import { ConversationsProvider } from "../contexts/ConversationsProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  const [profile, setprofile] = useLocalStorage('profile', '')
  const dashboard = (
    <SocketProvider token={profile.token}>
      <ContactsProvider token={profile.token}>
        <ConversationsProvider myId={profile._id} token={profile.token} knownAs={profile.knownAs} email={profile.email}>
          <Dashboard myId={profile._id} knownAs={profile.knownAs} email={profile.email} onLogout={setprofile} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )

  return (
    profile ? dashboard : <Login onAuthSubmit={setprofile} />
  )
}

export default App;
