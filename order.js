// wait for the page to load before anything runs
document.addEventListener('DOMContentLoaded', function () {

    // get all the stuff we need
    const quantityInputs = document.querySelectorAll('.qty-input'); // the input boxes
    const orderTableBody = document.getElementById('orderTableBody'); // where the order shows
    const totalPrice = document.getElementById('totalPrice'); // where total price shows
    const addToFav = document.getElementById('addToFavorites'); // save fav button
    const applyFav = document.getElementById('applyFavorites'); // load fav button
    const buyNow = document.getElementById('buyNow'); // buy button

    let currentOrder = []; // keeps track of what's selected

    // whenever a quantity changes, update the table
    quantityInputs.forEach(function (input) {
        input.addEventListener('change', updateOrder); // just refreshing things
    });

    // when save fav is clicked, store the current selection
    addToFav.addEventListener('click', function () {
        if (!currentOrder.length) {
            alert('Nothing picked yet.');
            return;
        }

        // just storing the selection in localStorage
        localStorage.setItem('favoriteOrder', JSON.stringify(currentOrder));
        alert('Order saved to favorites!');
    });

    // when load fav is clicked, fill back the saved stuff
    applyFav.addEventListener('click', function () {
        const fav = JSON.parse(localStorage.getItem('favoriteOrder') || '[]');

        // clear everything first
        quantityInputs.forEach(function (input) {
            input.value = 0;
        });

        // fill back whatever was saved
        fav.forEach(function (item) {
            const input = document.querySelector('.qty-input[data-name="' + item.name + '"]');
            if (input) {
                input.value = item.quantity;
            }
        });

        updateOrder(); // refresh the summary
    });

    // when buy now is clicked
    buyNow.addEventListener('click', function () {
        if (!currentOrder.length) {
            alert('No items selected.');
            return;
        }

        // store the order for the next page and go there
        sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        window.location.href = 'checkout.html'; // yk, move on to checkout
    });

    // Updates the summary table and total price
    function updateOrder() {
        currentOrder = []; // reset order
        orderTableBody.innerHTML = ''; // clear out the table
        let total = 0;

        quantityInputs.forEach(function (input) {
            const qty = parseInt(input.value);
            if (qty > 0) {
                const name = input.dataset.name;
                const price = parseFloat(input.dataset.price);
                const subtotal = qty * price;

                // store the item
                currentOrder.push({ name: name, quantity: qty, subtotal: subtotal });

                // show it in the table
                orderTableBody.innerHTML +=
                    '<tr><td>' + name + '</td><td>$' + price + '</td><td>' + qty + '</td><td>$' + subtotal + '</td></tr>';

                total += subtotal;
            }
        });

        totalPrice.textContent = '$' + total; // show total
    }

    // Reset Table button (added for assignment, clears all quantities)
    const resetTableBtn = document.getElementById('resetTableBtn');
    if (resetTableBtn) {
        resetTableBtn.addEventListener('click', function () {
            quantityInputs.forEach(function (input) {
                input.value = 0;
            });
            updateOrder();
        });
    }

    // run it once on page load just to be safe
    updateOrder();
});
