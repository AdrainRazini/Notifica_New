import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const userImg = document.getElementById('user');
const loginBtn = document.getElementById('login-button');
const userName = localStorage.getItem('username');
const userPhoto = localStorage.getItem('userphoto') || 'image/perfil_user.png';

userImg.src = userPhoto;
if (userName) {
  document.getElementById('username-display').textContent = userName;
  loginBtn.textContent = 'Sair';
  loginBtn.onclick = logout;
} else {
  loginBtn.textContent = 'Entrar';
  loginBtn.onclick = () => window.location.href = 'login.html';
}

userImg.onclick = () => {
  window.location.href = userName ? 'user-dashboard.html' : 'login.html';
};

async function logout() {
  try {
    await signOut(auth);
    localStorage.clear();
    location.reload();
  } catch (err) {
    console.error("Erro no logout:", err);
  }
}

const db = getFirestore();
async function verificarPermissaoAdmin() {
  const email = localStorage.getItem('useremail');
  if (!email) return;

  const userRef = doc(db, "users", email);
  const userSnap = await getDoc(userRef);
  const isAdmin = userSnap.exists() && userSnap.data().role === "admin";

  document.querySelector('[onclick="gerenciar_url()"]').style.display = isAdmin ? "inline-block" : "none";
  document.querySelector('[onclick="users_url()"]').style.display = isAdmin ? "inline-block" : "none";
}
verificarPermissaoAdmin();
