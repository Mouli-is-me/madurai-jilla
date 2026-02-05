async function placeOrder() {
  let table = document.getElementById("table").value;

  if (!table) {
    alert("Enter table number");
    return;
  }

  const orderData = {
    table: table,
    items: cart,
    total: total,
    status: "NEW",
    time: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "orders"), orderData);

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
