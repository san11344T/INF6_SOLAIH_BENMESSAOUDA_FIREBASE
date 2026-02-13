import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

// ===== ELEMENTS HTML =====
// Formulaires 
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

// Boutons
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

// Champs Inscription
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupError = document.getElementById("signup-error");
signupError.hidden =true;

// Champs Connexion
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");
loginError.hidden =true;

// Sections
const authSection = document.getElementById("auth-section");
const userSection = document.getElementById("user-section");
const userEmailSpan = document.getElementById("user-email");



// ===== GESTION DES ERREURS  =====
function gererErreur(error) {
  console.log("Code erreur:", error.code); 
  switch (error.code) {
    case "auth/invalid-email":
      return "L'adresse email n'est pas valide (format incorrect).";
    case "auth/user-not-found":
      return "Aucun compte ne correspond à cet email.";
    case "auth/wrong-password":
      return "Mot de passe incorrect.";
    case "auth/invalid-credential":
      
      return "Email ou mot de passe incorrect.";
    case "auth/email-already-in-use":
      return "Cet email est déjà utilisé par un autre compte.";
    case "auth/weak-password":
      return "Le mot de passe doit faire au moins 8 caractères."; 
    case "auth/missing-password":
      return "Veuillez entrer un mot de passe.";
    default:
      return "Une erreur est survenue : " + error.message;
  }
}

// ===== INSCRIPTION =====
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signupError.textContent = ""; 
  
  const email = signupEmail.value;
  const password = signupPassword.value;

  if (!email.includes("@")) {
    signupError.textContent = "Il manque le '@' dans le mail.";
    signupError.hidden=false;
    return; 
  }

  if (!email.includes(".") || email.lastIndexOf(".") < email.indexOf("@")) {
    signupError.textContent = "Format invalide (il manque le .com ou le domaine).";
    signupError.hidden=false;
    return;
  }

  if (password.length < 8) {
    signupError.textContent = "Le mot de passe doit être minimum 8 caractères.";
    signupError.hidden=false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user.email);
  } catch (error) {
    signupError.textContent = gererErreur(error);
    signupError.hidden=false;
  }
});

// ===== CONNEXION =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = ""; 

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );
    console.log("User logged in:", userCredential.user.email);
  } catch (error) {
    loginError.textContent = gererErreur(error);
    loginError.hidden=false;
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

// ===== PUBLICATION (Écriture) =====

// ===== ELEMENTS HTML  =====
const messageInput = document.getElementById("message-input");
const publishBtn = document.getElementById("publish-btn");
const messagesList = document.getElementById("messages-list");

publishBtn.addEventListener("click", async () => {
  if (messageInput.value.trim() === "") return;
  
  try {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "messages"), {
        content: messageInput.value,
        email: user.email,
        uid: user.uid,
        timestamp: serverTimestamp() 
      });
      messageInput.value = ""; 
      console.log("Message publié !");
    } else {
        alert("Vous devez être connecté pour publier.");
    }
  } catch (error) {
    console.error("Erreur d'écriture : ", error);
    alert("Erreur lors de la publication");
  }
});

// ===== AFFICHAGE =====
const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
  messagesList.innerHTML = ""; 

  snapshot.forEach((doc) => {
    const msg = doc.data();
    
    const msgElement = document.createElement("article");

    msgElement.style.border = "1px solid #ccc";
    msgElement.style.margin = "10px 0";
    msgElement.style.padding = "10px";
    msgElement.style.borderRadius = "5px";
    
    const date = msg.timestamp ? msg.timestamp.toDate().toLocaleString() : "À l'instant";

    msgElement.innerHTML = `
    <header style="margin-bottom: 5px;">
      <strong>${msg.email}</strong> 
      <small style="color:gray">(${date})</small>
    </header>
      <p style="margin-top:5px">${msg.content}</p>
    `;
    
    messagesList.appendChild(msgElement);
  });
});


