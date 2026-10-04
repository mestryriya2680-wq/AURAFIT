// ===============================
// AURAFIT SHOPPING SYSTEM
// ===============================

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ---------- CART ----------

function addToCart(name, price, image, category) {
    let cart = getData("aurafit_cart");

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            category: category,
            qty: 1
        });
    }

    saveData("aurafit_cart", cart);

    alert("🛒 " + name + " added to cart!");
    updateCartCount();
}

function buyNow(name, price, image, category) {
    let item = {
        name: name,
        price: price,
        image: image,
        category: category,
        qty: 1
    };

    localStorage.setItem("aurafit_buy_now", JSON.stringify(item));
    window.location.href = "checkout.html";
}

function getCartTotal() {
    let cart = getData("aurafit_cart");

    return cart.reduce((total, item) => {
        return total + (item.price * item.qty);
    }, 0);
}

function updateCartCount() {
    let cart = getData("aurafit_cart");

    let count = cart.reduce((total, item) => {
        return total + item.qty;
    }, 0);

    let badge = document.getElementById("cart-count");

    if (badge) {
        badge.innerText = count;
    }
}

// ---------- WISHLIST ----------

function toggleWishlist(name, price, image, category) {

    let wishlist = getData("aurafit_wishlist");

    let index = wishlist.findIndex(item => item.name === name);

    if (index !== -1) {
        wishlist.splice(index, 1);
        alert("♡ Removed from wishlist");
    } else {
        wishlist.push({
            name: name,
            price: price,
            image: image,
            category: category
        });

        alert("❤️ Added to wishlist!");
    }

    saveData("aurafit_wishlist", wishlist);
}

// ---------- CART PAGE ----------

function renderCart() {

    let cart = getData("aurafit_cart");
    let container = document.getElementById("cart-items");
    let totalBox = document.getElementById("cart-total");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h2>🛒 Your Cart is Empty</h2>
                <p>Add some beautiful AuraFit products!</p>
                <a href="home.html">Continue Shopping</a>
            </div>
        `;

        if (totalBox) totalBox.innerText = "₹0";
        return;
    }

    cart.forEach((item, index) => {

        container.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>${item.category}</p>
                    <h3>₹${item.price}</h3>

                    <div class="quantity">
                        <button onclick="changeQty(${index}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>

                    <button class="remove"
                    onclick="removeFromCart(${index})">
                    🗑 Remove
                    </button>
                </div>

            </div>
        `;
    });

    if (totalBox) {
        totalBox.innerText = "₹" + getCartTotal();
    }
}

function changeQty(index, amount) {

    let cart = getData("aurafit_cart");

    cart[index].qty += amount;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveData("aurafit_cart", cart);

    renderCart();
    updateCartCount();
}

function removeFromCart(index) {

    let cart = getData("aurafit_cart");

    cart.splice(index, 1);

    saveData("aurafit_cart", cart);

    renderCart();
    updateCartCount();
}

// ---------- CHECKOUT ----------

function loadCheckout() {

    let buyNowItem =
        JSON.parse(localStorage.getItem("aurafit_buy_now"));

    let cart = getData("aurafit_cart");

    let items = buyNowItem ? [buyNowItem] : cart;

    let container = document.getElementById("checkout-items");
    let totalBox = document.getElementById("checkout-total");

    if (!container) return;

    container.innerHTML = "";

    let total = 0;

    items.forEach(item => {

        total += item.price * item.qty;

        container.innerHTML += `
            <div class="checkout-item">

                <img src="${item.image}">

                <div>
                    <h3>${item.name}</h3>
                    <p>Qty: ${item.qty}</p>
                    <strong>₹${item.price * item.qty}</strong>
                </div>

            </div>
        `;
    });

    totalBox.innerText = "₹" + total;
}

// ---------- PLACE ORDER ----------

function placeOrder() {

    let name = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;
    let address = document.getElementById("customer-address").value;
    let payment = document.getElementById("payment-method").value;

    if (!name || !phone || !address) {
        alert("⚠️ Please fill all details.");
        return;
    }

    let buyNowItem =
        JSON.parse(localStorage.getItem("aurafit_buy_now"));

    let cart = getData("aurafit_cart");

    let items = buyNowItem ? [buyNowItem] : cart;

    if (items.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = items.reduce((sum, item) => {
        return sum + item.price * item.qty;
    }, 0);

    let order = {
        orderId: "AF" + Date.now(),
        date: new Date().toLocaleString(),
        customer: name,
        phone: phone,
        address: address,
        payment: payment,
        items: items,
        total: total,
        status: "Order Placed"
    };

    let orders = getData("aurafit_orders");

    orders.unshift(order);

    saveData("aurafit_orders", orders);

    localStorage.removeItem("aurafit_buy_now");

    if (!buyNowItem) {
        localStorage.removeItem("aurafit_cart");
    }

    alert(
        "🎉 Order Placed Successfully!\n\n" +
        "Order ID: " + order.orderId +
        "\nTotal: ₹" + total
    );

    window.location.href = "my-orders.html";
}

// ---------- MY ORDERS ----------

function renderOrders() {

    let orders = getData("aurafit_orders");

    let container = document.getElementById("orders-list");

    if (!container) return;

    container.innerHTML = "";

    if (orders.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h2>📦 No Orders Yet</h2>
                <p>Your AuraFit orders will appear here.</p>
            </div>
        `;

        return;
    }

    orders.forEach(order => {

        let products = order.items.map(item =>
            `<p>• ${item.name} × ${item.qty}</p>`
        ).join("");

        container.innerHTML += `
            <div class="order-card">

                <div class="order-top">
                    <h3>Order #${order.orderId}</h3>
                    <span>${order.status}</span>
                </div>

                <p>📅 ${order.date}</p>

                ${products}

                <hr>

                <p><b>Total:</b> ₹${order.total}</p>
                <p><b>Payment:</b> ${order.payment}</p>
                <p><b>Delivery:</b> ${order.address}</p>

            </div>
        `;
    });
}

// ---------- PROFILE ----------

function saveProfile() {

    let profile = {
        name: document.getElementById("profile-name").value,
        email: document.getElementById("profile-email").value,
        phone: document.getElementById("profile-phone").value,
        address: document.getElementById("profile-address").value
    };

    localStorage.setItem(
        "aurafit_profile",
        JSON.stringify(profile)
    );

    alert("💖 Profile Updated!");
}

function loadProfile() {

    let profile =
        JSON.parse(localStorage.getItem("aurafit_profile"));

    if (!profile) return;

    if (document.getElementById("profile-name"))
        document.getElementById("profile-name").value = profile.name || "";

    if (document.getElementById("profile-email"))
        document.getElementById("profile-email").value = profile.email || "";

    if (document.getElementById("profile-phone"))
        document.getElementById("profile-phone").value = profile.phone || "";

    if (document.getElementById("profile-address"))
        document.getElementById("profile-address").value = profile.address || "";
}

// ---------- LOGOUT ----------

function logout() {

    localStorage.removeItem("aurafit_profile");

    alert("👋 Logged out successfully!");

    window.location.href = "home.html";
}

// ---------- START ----------

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();
    renderCart();
    loadCheckout();
    renderOrders();
    loadProfile();

});