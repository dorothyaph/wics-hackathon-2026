// login.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { auth, db } from "./firebase-init.js";

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");

  const log = (msg) => {
    output.textContent = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
  };

  document.getElementById("signupBtn").addEventListener("click", async () => {
    try {
      const email = emailEl.value.trim();
      const password = passwordEl.value;
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      log({ ok: true, action: "signup", uid: cred.user.uid });
    } catch (e) {
      log({ ok: false, action: "signup", error: e.message });
    }
  });

  document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
      const email = emailEl.value.trim();
      const password = passwordEl.value;
      const cred = await signInWithEmailAndPassword(auth, email, password);
      log({ ok: true, action: "login", uid: cred.user.uid });
    } catch (e) {
      log({ ok: false, action: "login", error: e.message });
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    log({ ok: true, action: "logout" });
  });

  document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    try {
      const user = auth.currentUser;
      if (!user) return log("Not logged in.");

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      log({ ok: true, action: "saveProfile" });
    } catch (e) {
      log({ ok: false, action: "saveProfile", error: e.message });
    }
  });

  document.getElementById("loadProfileBtn").addEventListener("click", async () => {
    try {
      const user = auth.currentUser;
      if (!user) return log("Not logged in.");

      const snap = await getDoc(doc(db, "users", user.uid));
      log(snap.exists() ? snap.data() : "No profile found.");
    } catch (e) {
      log({ ok: false, action: "loadProfile", error: e.message });
    }
  });

  onAuthStateChanged(auth, (user) => {
    log(user ? { auth: "in", email: user.email, uid: user.uid } : { auth: "out" });
  });
});