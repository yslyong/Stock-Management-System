import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../Firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signin(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signout(email, password) {
    return auth.signOut();
  }

  async function addname(data) {
    const usersAdd = db.collection("staff");

    return usersAdd.doc(data.Email.toLowerCase()).set({
      Staff_Name: data.Name.toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      Staff_Nickname: data.NickName.toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      Staff_ICNo: data.ICNo,
      Staff_DOB: data.DOB,
      Staff_Email: data.Email.toLowerCase(),
      Staff_Contact: data.ContactNo,
      Outlet_Name: data.Outlet_Name,
      Role_Name: data.Role_Name,
    });
  }

  async function getInfo(email) {
    const user = db.collection("staff").doc(email);
    const doc = await user.get();

    localStorage.setItem("email", email);
    localStorage.setItem("user", JSON.stringify(doc.data()));
  }

  async function clearInfo() {
    localStorage.setItem("email", " ");
    localStorage.setItem("user", JSON.stringify({}));
  }

  async function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  async function updateInfo(data) {
    const usersUpdte = db.collection("staff").doc(currentUser.email);

    await usersUpdte.update({
      Staff_Name: data.Name.toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      Staff_ICNo: data.ICNo,
      Staff_DOB: data.DOB,
      Staff_Contact: data.ContactNo,
      Outlet_Name: data.Outlet_Name,
      Role_Name: data.Role_Name,
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signin,
    signup,
    signout,
    addname,
    getInfo,
    clearInfo,
    updatePassword,
    updateInfo,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
