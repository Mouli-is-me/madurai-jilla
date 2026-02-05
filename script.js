let cart = {};
let total = 0;
let count = 0;

function addItem(name, price) {
  if (!cart[name]) cart[name] = { qty: 0, price };
  cart[name].qty++;
  total += price;
  count++;
  updateBar();
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

function updateBar() {
  document.getElementById("itemCount").innerText = count;
  document.getElementById("total").innerText = total;
}


function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

function placeOrder() {
  let table = document.getElementById("table").value || "N/A";
  let msg = `🍴 MADURAI JILLA\nTable: ${table}\n\nOrder:\n`;

  for (let i in cart) {
    msg += `- ${i} x ${cart[i].qty}\n`;
  }

  msg += `\nTotal: ₹${total}`;
  window.open(`https://wa.me/919677398925?text=${encodeURIComponent(msg)}`);
}


