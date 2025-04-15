document.addEventListener('DOMContentLoaded', () => {

    // grab inputs and buttons
    const quantityInputs = document.querySelectorAll('.qty-input');
    const orderTableBody = document.getElementById('orderTableBody');
    const totalPrice = document.getElementById('totalPrice');
    const addToFav = document.getElementById('addToFavorites');
    const applyFav = document.getElementById('applyFavorites');
    const buyNow = document.getElementById('buyNow');

    let currentOrder = []; // store items picked

    // update table on input change
    quantityInputs.forEach(input => input.addEventListener('change', updateOrder));

    // save current order to favorites (requirement: save order as favorite)
    addToFav.addEventListener('click', () => {
        if (!currentOrder.length) return alert('Nothing picked yet.');
        localStorage.setItem('favoriteOrder', JSON.stringify(currentOrder));
        // Feedback to user that order was saved
        alert('Order saved to favorites!');
    });

    // load favorite order (requirement: apply favorites to form)
    applyFav.addEventListener('click', () => {
        const fav = JSON.parse(localStorage.getItem('favoriteOrder') || '[]');
        quantityInputs.forEach(input => input.value = 0); // reset all
        fav.forEach(item => {
            const input = document.querySelector(`.qty-input[data-name="${item.name}"]`);
            if (input) input.value = item.quantity; // refill inputs
        });
        updateOrder(); // refresh table
    });

    // save order and go to checkout page (requirement: navigate to new page)
    buyNow.addEventListener('click', () => {
        if (!currentOrder.length) return alert('No items selected.');
        sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        window.location.href = 'checkout.html';
    });

    // refresh table and total price (requirement: show items and total price)
    function updateOrder() {
        currentOrder = []; // start fresh
        orderTableBody.innerHTML = '';
        let total = 0;

        quantityInputs.forEach(input => {
            const qty = parseInt(input.value);
            if (qty > 0) {
                const name = input.dataset.name;
                const price = parseFloat(input.dataset.price);
                const subtotal = qty * price;

                // Store item data for checkout and favorites
                currentOrder.push({ name, quantity: qty, subtotal });

                // add row to order summary table
                orderTableBody.innerHTML += `<tr><td>${name}</td><td>$${price}</td><td>${qty}</td><td>$${subtotal}</td></tr>`;

                total += subtotal; // sum up
            }
        });

        totalPrice.textContent = `$${total}`; // show total
    }

    updateOrder(); // first update when loaded
});
