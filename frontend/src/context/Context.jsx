import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useAxiosPublic } from "../hooks/useAxiosPublic";

const TaskContext = createContext();

const TaskContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const axiosPublic = useAxiosPublic();

  //Authenticating the user
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const createUserWithEmail = (email, password, name) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password, name);
  };

  const signInWithEmail = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updateData) => {
    return updateProfile(auth.currentUser, updateData);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  //get Current User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const authUser = { email: user.email };
        axiosPublic
          .post("/jwt", authUser, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res.data);
            setUser(user);
            setLoading(false);
          });
      } else {
        axiosPublic
          .post(
            "/logout",
            {},
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            //console.log(res.data);
            if (res) {
              setUser(null);
              setLoading(false);
            }
          });
      }
    });

    return () => unsubscribe();
  }, []);

  //console.log(user);

  return (
    <TaskContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        createUserWithEmail,
        signInWithEmail,
        updateUser,
        signOutUser,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskContextProvider };
