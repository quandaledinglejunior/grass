document.addEventListener('DOMContentLoaded', () => {

    // get summary table and form elements
    const summaryTableBody = document.getElementById('summaryTableBody');
    const orderTotal = document.getElementById('orderTotal');
    const checkoutForm = document.getElementById('checkoutForm');

    // load saved order from session storage (requirement: show order summary)
    function loadOrder() {
        const saved = sessionStorage.getItem('currentOrder');
        if (!saved) {
            alert('No order here. Go back.');
            window.location.href = 'order.html';
            return;
        }

        // Display order items in summary table
        const order = JSON.parse(saved);
        summaryTableBody.innerHTML = '';
        let total = 0;

        order.forEach(item => {
            summaryTableBody.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.subtotal}</td></tr>`;
            total += item.subtotal;
        });

        orderTotal.textContent = `$${total}`; // display total price
    }

    // handle payment submission (requirement: thank user with delivery date)
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevent form submission reload
        alert("Order placed! Delivery in 7–10 days."); // include delivery date in message
        sessionStorage.removeItem('currentOrder'); // clear order after payment
    });

    // format card number with spaces (4242 4242 4242 4242)
    document.getElementById('cardNumber').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0,16).replace(/(.{4})/g, '$1 ').trim();
    });

    // format expiry date as MM/YY
    document.getElementById('expDate').addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0,4);
        e.target.value = val.length > 2 ? `${val.slice(0,2)}/${val.slice(2)}` : val;
    });

    loadOrder(); // load order data when page loads
});
