document.addEventListener('DOMContentLoaded', function() {

    // get all quantity inputs and buttons from the page
    const quantityInputs = document.querySelectorAll('.qty-input');
    const orderTableBody = document.getElementById('orderTableBody');
    const totalPriceElement = document.getElementById('totalPrice');
    const addToFavoritesBtn = document.getElementById('addToFavorites');
    const applyFavoritesBtn = document.getElementById('applyFavorites');
    const buyNowBtn = document.getElementById('buyNow');

    // this will store the current selected items
    let currentOrder = [];

    // when user changes quantity, update the table
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateOrder);
    });

    // when user clicks "add to favorites"
    addToFavoritesBtn.addEventListener('click', () => {
        if (currentOrder.length === 0) {
            alert('Add items before saving.');
            return;
        }

        // save the current order to browser memory
        localStorage.setItem('favoriteOrder', JSON.stringify(currentOrder));
    });

    // when user clicks "apply favorites"
    applyFavoritesBtn.addEventListener('click', () => {
        // get the saved order from browser
        const fav = JSON.parse(localStorage.getItem('favoriteOrder') || '[]');

        // reset all input values first
        quantityInputs.forEach(input => input.value = 0);

        // fill inputs using saved data
        fav.forEach(item => {
            const input = document.querySelector(`.qty-input[data-name="${item.name}"]`);
            if (input) input.value = item.quantity;
        });

        // update table with this data
        updateOrder();
    });

    // when user clicks "buy now"
    buyNowBtn.addEventListener('click', () => {
        if (currentOrder.length === 0) {
            alert('Add some items first.');
            return;
        }

        // save the current order to go to checkout
        sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        window.location.href = 'checkout.html'; // go to next page
    });

    // update the order table and total price
    function updateOrder() {
        currentOrder = []; // clear the list
        orderTableBody.innerHTML = ''; // clear table
        let total = 0;

        // loop through all quantity inputs
        quantityInputs.forEach(input => {
            const qty = parseInt(input.value);
            if (qty > 0) {
                const name = input.dataset.name;
                const price = parseFloat(input.dataset.price);
                const subtotal = qty * price;

                // add item to order
                currentOrder.push({ name, quantity: qty, subtotal });

                // show item in table
                const row = document.createElement('tr');
                row.innerHTML = `<td>${name}</td><td>$${price}</td><td>${qty}</td><td>$${subtotal}</td>`;
                orderTableBody.appendChild(row);

                // add to total price
                total += subtotal;
            }
        });

        // show total price on page
        totalPriceElement.textContent = `$${total}`;
    }
});
