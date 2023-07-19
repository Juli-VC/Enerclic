import React, { createContext, useEffect, useState } from 'react'

export const ProviderContext = createContext();


export const CloudContext = ({ children }) => {

  const [isLogged, setIsLogged] = useState(false);
  const [usertoken, setUserToken] = useState(null);


  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      setUserToken(window.localStorage.getItem("token"))
      setIsLogged(true)
    }


  }, [isLogged]) //cuando detecte un cambio, recarga. 


  return (
    <ProviderContext.Provider value={{
      isLogged, setIsLogged, usertoken, setUserToken,
    }}
    >
      {children}
    </ProviderContext.Provider>

  )
}
