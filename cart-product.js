
   // ===============================
// AURAFIT CART PAGE
// ===============================

function displayCart() {

    const container = document.getElementById("cartProducts");
    const totalBox = document.getElementById("cartTotal");
    const empty = document.getElementById("emptyCart");

    let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

    container.innerHTML = "";
    totalBox.innerHTML = "";

    // CART EMPTY
    if (cart.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    let total = 0;

    cart.forEach((product, index) => {

        // Price can be ₹1499 OR 1499
        let price = parseFloat(
            String(product.price)
                .replace("₹", "")
                .replace(",", "")
        ) || 0;

        let quantity = Number(product.quantity) || 1;

        total += price * quantity;

        container.innerHTML += `

            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="product-info">

                    <h2>${product.name}</h2>

                    <p>Price: ₹${price}</p>

                    <p>
                        Quantity: ${quantity}
                    </p>

                    <button
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </div>

            </div>

        `;
    });

    totalBox.innerHTML = `

        <div class="cart-total">

            <h2>
                Total: ₹${total.toLocaleString("en-IN")}
            </h2>

            <button onclick="orderNow()">
                ORDER NOW
            </button>

        </div>

    `;
}


// ===============================
// REMOVE PRODUCT
// ===============================

function removeFromCart(index) {

    let cart =
        JSON.parse(localStorage.getItem("cartProducts")) || [];

    cart.splice(index, 1);

    localStorage.setItem(
        "cartProducts",
        JSON.stringify(cart)
    );

    displayCart();
}


// ===============================
// ORDER NOW
// ===============================

function buyNow() {

    window.location.href = "payment.html";

}


// ===============================
// LOAD CART
// ===============================

displayCart();
