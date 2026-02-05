import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx0gBDakjvl0v9K6UNXEemMAdZoamlQI8",
  authDomain: "madurai-jilla.firebaseapp.com",
  projectId: "madurai-jilla",
  storageBucket: "madurai-jilla.firebasestorage.app",
  messagingSenderId: "164673347054",
  appId: "1:164673347054:web:d151919fb15a2941f202ff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let cart = {};
let total = 0;
let count = 0;

function addItem(name, price) {
  if (!cart[name]) cart[name] = { qty: 0, price };
  cart[name].qty++;
  total += price;
  count++;
  updateBar();

  const modal = document.getElementById("cart-modal");
  if (modal.style.display === "flex") {
    renderCart();
  }

  navigator.vibrate?.(30);
}

function updateBar() {
  document.getElementById("itemCount").innerText = count;
  document.getElementById("total").innerText = total;
}

function showCategory(id, btn) {
  document
    .querySelectorAll(".category")
    .forEach((c) => c.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document
    .querySelectorAll(".tabs button")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function openCart() {
  if (count === 0) {
    alert("Cart is empty");
    return;
  }

  const modal = document.getElementById("cart-modal");
  modal.style.display = "flex";

  renderCart();
}

function renderCart() {
  const box = document.getElementById("cart-items");
  box.innerHTML = "";

  for (let item in cart) {
    box.innerHTML += `
      <div class="cart-item">
        <span>${item}</span>

        <div class="qty">
          <button onclick="decreaseQty('${item}')">−</button>
          <span>${cart[item].qty}</span>
          <button onclick="increaseQty('${item}')">+</button>
        </div>
      </div>
    `;
  }

  updateBar();
}

function increaseQty(item) {
  cart[item].qty++;
  count++;
  total += cart[item].price;
  renderCart();
}

function decreaseQty(item) {
  cart[item].qty--;
  count--;
  total -= cart[item].price;

  if (cart[item].qty === 0) {
    delete cart[item];
  }

  if (count === 0) {
    closeCart();
  } else {
    renderCart();
  }
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

async function placeOrder() {
  let table = document.getElementById("table").value;

  if (!table) {
    alert("Enter table number");
    return;
  }

  const order = {
    table,
    items: cart,
    total,
    status: "NEW",
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "orders"), order);

    alert("✅ Order placed successfully!");

    cart = {};
    total = 0;
    count = 0;
    updateBar();
    closeCart();
  } catch (err) {
    alert("❌ Failed to place order");
    console.error(err);
  }
}
window.addItem = addItem;
window.openCart = openCart;
window.closeCart = closeCart;
window.showCategory = showCategory;
window.placeOrder = placeOrder;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;







