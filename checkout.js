document.addEventListener('DOMContentLoaded', function() {

    // get form and other stuff from HTML
    const summaryTableBody = document.getElementById('summaryTableBody');
    const orderTotalElement = document.getElementById('orderTotal');
    const checkoutForm = document.getElementById('checkoutForm');

    // this shows the order table using saved order
    function loadOrder() {
        const saved = sessionStorage.getItem('currentOrder');

        // if nothing in cart, send back to order page
        if (!saved) {
            alert('No order found. Go back and add items.');
            window.location.href = 'order.html';
            return;
        }

        // show the items in a table
        const order = JSON.parse(saved);
        let total = 0;
        summaryTableBody.innerHTML = '';

        order.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td><td>$${item.subtotal}</td>`;
            summaryTableBody.appendChild(row);
            total += item.subtotal;
        });

        // show total price
        orderTotalElement.textContent = `$${total}`;
    }

    // when user clicks pay button
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); // don’t reload the page

        // just show a message saying thank you
        alert("Thanks! We’ll deliver in 7–10 business days.");

        // remove order from storage after payment
        sessionStorage.removeItem('currentOrder');
    });

    // format card number so it’s easy to read (adds space every 4 digits)
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').substring(0, 16); // only numbers, max 16
        e.target.value = value.replace(/(.{4})/g, '$1 ').trim(); // space after 4 digits
    });

    // format expiry date like MM/YY
    document.getElementById('expDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').substring(0, 4); // only numbers, max 4
        if (value.length >= 3) {
            value = value.substring(0, 2) + '/' + value.substring(2); // add slash after MM
        }
        e.target.value = value;
    });

    // load the order when page loads
    loadOrder();
});
