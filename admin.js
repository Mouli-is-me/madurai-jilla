import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx0gBDakjvl0v9K6UNXEemMAdZoamlQI8",
  authDomain: "madurai-jilla.firebaseapp.com",
  projectId: "madurai-jilla",
  storageBucket: "madurai-jilla.firebasestorage.app",
  messagingSenderId: "164673347054",
  appId: "1:164673347054:web:d151919fb15a2941f202ff",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const ordersDiv = document.getElementById("orders");
  console.log("Orders div:", ordersDiv);

 onSnapshot(collection(db, "orders"), (snapshot) => {
  ordersDiv.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const o = docSnap.data();

    let itemsHtml = "";
    for (let item in o.items) {
      itemsHtml += `<div>• ${item} x ${o.items[item].qty}</div>`;
    }

    ordersDiv.innerHTML += `
      <div class="order-card">
        <div class="order-header">
          <span>Table ${o.table}</span>
          <span>₹${o.total}</span>
        </div>

        <div class="items">
          ${itemsHtml}
        </div>

        <div class="status ${o.status}">
          Status: ${o.status}
        </div>

        ${
          o.status === "NEW"
            ? `<button onclick="markDone('${docSnap.id}')">Mark Done</button>`
            : ""
        }
      </div>
    `;
  });
});


window.markDone = async function (id) {
  await updateDoc(doc(db, "orders", id), {
    status: "DONE",
  });
};


