const socket = io();

socket.on("refreshCart", (cart) => {
    const cartList = document.getElementById("cart-list");
    const totalElement = document.getElementById("cart-total");

    if (cartList) {
        cartList.innerHTML = "";
        cart.products.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${item.product.title}</strong> - Precio: $${item.product.price}
                - Cantidad: ${item.quantity}
                - Subtotal: $${item.product.price * item.quantity}
            `;
            cartList.appendChild(li);
        });
    }

    if (totalElement) {
        const total = cart.products.reduce((acc, p) => acc + (p.product.price * p.quantity), 0);
        totalElement.textContent = `Total: $${total}`;
    }
});