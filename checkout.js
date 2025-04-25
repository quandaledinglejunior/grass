// wait for the page to load first
document.addEventListener('DOMContentLoaded', function () {

    // grab all the elements we need
    var summaryTableBody = document.getElementById('summaryTableBody');
    var orderTotal = document.getElementById('orderTotal');
    var checkoutForm = document.getElementById('checkoutForm');

    // this loads the order that was saved from the order page
    function loadOrder() {
        var saved = sessionStorage.getItem('currentOrder');

        // if there's nothing saved, go back
        if (!saved) {
            alert('No order here. Go back.');
            window.location.href = 'order.html';
            return;
        }

        // parse the saved order and show it
        var order = JSON.parse(saved);
        summaryTableBody.innerHTML = '';
        var total = 0;

        for (var i = 0; i < order.length; i++) {
            var item = order[i];
            summaryTableBody.innerHTML += 
                '<tr><td>' + item.name + '</td><td>' + item.quantity + '</td><td>$' + item.subtotal + '</td></tr>';
            total += item.subtotal;
        }

        // show total at the bottom
        orderTotal.textContent = '$' + total;
    }

    // when the form is submitted (clicked pay), show a message and go back to order page
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault(); // don’t reload the page
        alert("Order placed! Delivery in 7–10 days.");
        sessionStorage.removeItem('currentOrder'); // clear the saved order
        window.location.href = 'order.html'; // go back to order page
    });

    // format the card number like 4242 4242 4242 4242
    document.getElementById('cardNumber').addEventListener('input', function (e) {
        var cleaned = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = cleaned.replace(/(.{4})/g, '$1 ').trim();
    });

    // format expiry date like MM/YY
    document.getElementById('expDate').addEventListener('input', function (e) {
        var val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length > 2) {
            e.target.value = val.slice(0, 2) + '/' + val.slice(2);
        } else {
            e.target.value = val;
        }
    });

    // run this once to show the saved order when page opens
    loadOrder();
});
