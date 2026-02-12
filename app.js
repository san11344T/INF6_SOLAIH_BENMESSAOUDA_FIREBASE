import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyB01YSH05BDlkoYW1nzUjo_6i62pCOLsC8",
  authDomain: "iman-sinda-fbase.firebaseapp.com",
  projectId: "iman-sinda-fbase",
  storageBucket: "iman-sinda-fbase.firebasestorage.app",
  messagingSenderId: "311267601093",
  appId: "1:311267601093:web:7afc900013a286d131deac",
  measurementId: "G-WVDWP3KMQN"
};



// ===== INITIALISATION =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== ELEMENTS HTML =====
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const authSection = document.getElementById("auth-section");
const userSection = document.getElementById("user-section");
const userEmailSpan = document.getElementById("user-email");

// ===== INSCRIPTION =====
signupBtn.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupEmail.value,
      signupPassword.value
    );
    console.log("User created:", userCredential.user.email);
  } catch (error) {
    alert(error.message);
  }
});

// ===== CONNEXION =====
loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );
    console.log("User logged in:", userCredential.user.email);
  } catch (error) {
    alert(error.message);
  }
});

// ===== DÉCONNEXION =====
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// ===== UI DYNAMIQUE =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    userSection.style.display = "block";
    userEmailSpan.textContent = user.email;
  } else {
    authSection.style.display = "block";
    userSection.style.display = "none";
    userEmailSpan.textContent = "";
  }
});
