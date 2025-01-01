"use client"
import React from "react";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import { auth } from "/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth";
import Home from "../components/home";
import NewHeader from "../components/NewHeader";

export default function Account() {
  const [user, setUser] = React.useState(null);
  const [authState, setAuthState] = React.useState(null);

  React.useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(auth,
      async authenticatedUser => {
        if (authenticatedUser) {
          setUser(authenticatedUser.email);
          setAuthState('home');
        } else {
          setUser(null);
          setAuthState('login');
        }
      })

    return unSubscribeAuth;
  }, [user])

  if (authState === 'login') return <div><  NewHeader /><Login setAuthState={setAuthState} setUser={setUser} /><Footer /></div>
  if (authState === 'register') return <div><NewHeader /><Register setAuthState={setAuthState} setUser={setUser} /><Footer /></div>
  if (user) return <Home user={user} setAuthState={setAuthState} setUser={setUser} />
}