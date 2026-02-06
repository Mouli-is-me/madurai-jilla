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

let currentTab = "new";
let allOrders = [];

const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    renderOrders();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const ordersDiv = document.getElementById("orders");

  onSnapshot(collection(db, "orders"), (snapshot) => {
    allOrders = [];

    snapshot.forEach((docSnap) => {
      allOrders.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    renderOrders();
  });
});

function renderOrders() {
  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  allOrders
    .filter(o => {
      if (currentTab === "new") return o.status === "NEW";
      if (currentTab === "done") return o.status === "DONE";
    })
    .forEach(o => {
      let itemsHtml = "";

      if (o.items && typeof o.items === "object") {
        for (let itemName in o.items) {
          const item = o.items[itemName];
          const qty = item.qty ?? 1;

          itemsHtml += `
            <div class="item-line">
              ${itemName} × ${qty}
            </div>
          `;
        }
      }

      ordersDiv.innerHTML += `
        <div class="order-card ${o.status === "DONE" ? "done" : ""}">
          <div class="order-header">
            <span>${o.name ?? "Customer"}</span>
            <span>₹${o.total ?? 0}</span>
          </div>

          <div class="items">
            ${itemsHtml}
          </div>

          <div class="status ${o.status}">
            Status: ${o.status}
          </div>

          ${
            o.status === "NEW"
              ? `<button onclick="markDone('${o.id}')">Mark Done</button>`
              : ""
          }
        </div>
      `;
    });
}

window.markDone = async function (id) {
  await updateDoc(doc(db, "orders", id), {
    status: "DONE",
  });
};
