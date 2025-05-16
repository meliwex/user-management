import { useState } from 'react'
import Form from "./components/Auth/Form"
import MainPage from "./components/MainPage"

import { getAccessToken } from "./utils/token"

function App() {
  const [loggedIn, setLoggedIn] = useState(getAccessToken() ? true : false);


  return (
    <>
      {loggedIn ? (
        <MainPage setLoggedIn={setLoggedIn} />
      ) : (
        <Form setLoggedIn={setLoggedIn} />
      )}
    </>
  )
}

export default App
