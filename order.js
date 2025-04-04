// Order Page Script

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const quantityInputs = document.querySelectorAll('.qty-input');
    const orderTableBody = document.getElementById('orderTableBody');
    const totalPriceElement = document.getElementById('totalPrice');
    const addToFavoritesBtn = document.getElementById('addToFavorites');
    const applyFavoritesBtn = document.getElementById('applyFavorites');
    const buyNowBtn = document.getElementById('buyNow');
    
    // Local object to store the current order
    let currentOrder = [];
    
    // Add event listeners to all quantity inputs
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateOrderTable);
    });
    
    // Event listeners for the buttons
    addToFavoritesBtn.addEventListener('click', saveAsFavorite);
    applyFavoritesBtn.addEventListener('click', applyFavorites);
    buyNowBtn.addEventListener('click', proceedToCheckout);
    
    // Function to update the order table
    function updateOrderTable() {
        // Clear the current order array
        currentOrder = [];
        
        // Clear the table body
        orderTableBody.innerHTML = '';
        
        // Loop through all quantity inputs
        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            
            // If quantity is greater than 0, add to the order
            if (quantity > 0) {
                const name = input.getAttribute('data-name');
                const price = parseFloat(input.getAttribute('data-price'));
                const subtotal = price * quantity;
                
                // Add to current order array
                currentOrder.push({
                    name: name,
                    price: price,
                    quantity: quantity,
                    subtotal: subtotal
                });
                
                // Create table row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>$${price}</td>
                    <td>${quantity}</td>
                    <td>$${subtotal}</td>
                `;
                
                orderTableBody.appendChild(row);
            }
        });
        
        // Update total price
        updateTotalPrice();
    }
    
    // Function to update the total price
    function updateTotalPrice() {
        let total = 0;
        
        currentOrder.forEach(item => {
            total += item.subtotal;
        });
        
        totalPriceElement.textContent = `$${total}`;
    }
    
    // Function to save the current order as a favorite
    function saveAsFavorite() {
        // Check if the order is empty
        if (currentOrder.length === 0) {
            alert('Your order is empty. Add some items first!');
            return;
        }
        
        // Save to local storage
        localStorage.setItem('favoriteOrder', JSON.stringify(currentOrder));
        alert('Your order has been saved as a favorite!');
    }
    
    // Function to apply the favorite order
    function applyFavorites() {
        // Get the favorite order from local storage
        const favoriteOrder = localStorage.getItem('favoriteOrder');
        
        // Check if there is a favorite order
        if (!favoriteOrder) {
            alert('No favorite order found!');
            return;
        }
        
        // Parse the favorite order
        const parsedOrder = JSON.parse(favoriteOrder);
        
        // Clear all current selections
        quantityInputs.forEach(input => {
            input.value = 0;
        });
        
        // Apply the favorite order to the inputs
        parsedOrder.forEach(item => {
            const input = document.querySelector(`.qty-input[data-name="${item.name}"]`);
            if (input) {
                input.value = item.quantity;
            }
        });
        
        // Update the order table
        updateOrderTable();
        alert('Favorite order applied!');
    }
    
    // Function to proceed to checkout
    function proceedToCheckout() {
        // Check if the order is empty
        if (currentOrder.length === 0) {
            alert('Your order is empty. Add some items first!');
            return;
        }
        
        // Save the current order to session storage for checkout page
        sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
    
    // Check if there's an order in session storage (e.g., if user navigated back from checkout)
    const savedOrder = sessionStorage.getItem('currentOrder');
    if (savedOrder) {
        try {
            const parsedOrder = JSON.parse(savedOrder);
            
            // Clear all current selections
            quantityInputs.forEach(input => {
                input.value = 0;
            });
            
            // Apply the saved order
            parsedOrder.forEach(item => {
                const input = document.querySelector(`.qty-input[data-name="${item.name}"]`);
                if (input) {
                    input.value = item.quantity;
                }
            });
            
            // Update the order table
            updateOrderTable();
        } catch (error) {
            console.error('Error parsing saved order:', error);
        }
    }
});
