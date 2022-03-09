import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type useAuthProps = {};

import { auth } from "../firebase/clientApp";

const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  const signup = async () => {
    console.log("CALLING SIGN IN FUNCTION");
  };

  const getFirestoreUser = async (firebaseUser: any) => {
    console.log("HERE IS FIREBASE USER", firebaseUser);
  };

  const signInWithGoogle: any = async () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const signUpWithEmailAndPassword = async () => {};

  //   useEffect(() => {
  //     const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
  //       console.log("HERE IS USER", firebaseUser);
  //       if (firebaseUser) {
  //         getFirestoreUser(firebaseUser);
  //       }
  //     });
  //     return unsubscribe;
  //   }, []);

  useEffect(() => {
    console.log("HERE IS THE USER", user);
  }, [user]);

  return {
    signup,
    signInWithGoogle,
  };
};
export default useAuth;
