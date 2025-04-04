// Checkout Page Script

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const summaryTableBody = document.getElementById('summaryTableBody');
    const orderTotalElement = document.getElementById('orderTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    const modal = document.getElementById('confirmationModal');
    const closeButton = document.querySelector('.close-button');
    const returnToStoreButton = document.getElementById('returnToStore');
    const deliveryDateElement = document.getElementById('deliveryDate');
    const customerEmailElement = document.getElementById('customerEmail');
    
    // Format credit card number with spaces
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function(e) {
        // Remove all non-digits
        let value = e.target.value.replace(/\D/g, '');
        
        // Add a space after every 4 digits
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        
        // Update the input value
        e.target.value = value;
    });
    
    // Format expiry date with slash
    const expDateInput = document.getElementById('expDate');
    expDateInput.addEventListener('input', function(e) {
        // Remove all non-digits
        let value = e.target.value.replace(/\D/g, '');
        
        // Add a slash after the first 2 digits
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        
        // Update the input value
        e.target.value = value;
    });
    
    // Load order details from session storage
    function loadOrderDetails() {
        const savedOrder = sessionStorage.getItem('currentOrder');
        
        if (!savedOrder) {
            // If no order, redirect back to order page
            alert('No order found. Please select your items first.');
            window.location.href = 'order.html';
            return;
        }
        
        try {
            const parsedOrder = JSON.parse(savedOrder);
            
            // Clear the table body
            summaryTableBody.innerHTML = '';
            
            let total = 0;
            
            // Add each item to the table
            parsedOrder.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.subtotal}</td>
                `;
                
                summaryTableBody.appendChild(row);
                total += item.subtotal;
            });
            
            // Update the total
            orderTotalElement.textContent = `$${total}`;
            
        } catch (error) {
            console.error('Error parsing saved order:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    // Validate form inputs
    function validateForm() {
        let isValid = true;
        
        // Personal Details
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        
        // Delivery Details
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const zipCode = document.getElementById('zipCode');
        const country = document.getElementById('country');
        
        // Payment Information
        const cardName = document.getElementById('cardName');
        const cardNumber = document.getElementById('cardNumber');
        const expDate = document.getElementById('expDate');
        const cvv = document.getElementById('cvv');
        
        // Clear all previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Validate Personal Details
        if (firstName.value.trim() === '') {
            document.getElementById('firstNameError').textContent = 'First name is required';
            isValid = false;
        }
        
        if (lastName.value.trim() === '') {
            document.getElementById('lastNameError').textContent = 'Last name is required';
            isValid = false;
        }
        
        if (email.value.trim() === '') {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (phone.value.trim() === '') {
            document.getElementById('phoneError').textContent = 'Phone number is required';
            isValid = false;
        }
        
        // Validate Delivery Details
        if (address.value.trim() === '') {
            document.getElementById('addressError').textContent = 'Address is required';
            isValid = false;
        }
        
        if (city.value.trim() === '') {
            document.getElementById('cityError').textContent = 'City is required';
            isValid = false;
        }
        
        if (zipCode.value.trim() === '') {
            document.getElementById('zipCodeError').textContent = 'Postal/ZIP code is required';
            isValid = false;
        }
        
        if (country.value === '') {
            document.getElementById('countryError').textContent = 'Please select a country';
            isValid = false;
        }
        
        // Validate Payment Information
        if (cardName.value.trim() === '') {
            document.getElementById('cardNameError').textContent = 'Name on card is required';
            isValid = false;
        }
        
        if (cardNumber.value.trim() === '') {
            document.getElementById('cardNumberError').textContent = 'Card number is required';
            isValid = false;
        } else if (cardNumber.value.replace(/\s/g, '').length < 16) {
            document.getElementById('cardNumberError').textContent = 'Please enter a valid card number';
            isValid = false;
        }
        
        if (expDate.value.trim() === '') {
            document.getElementById('expDateError').textContent = 'Expiry date is required';
            isValid = false;
        } else if (!/^\d{2}\/\d{2}$/.test(expDate.value)) {
            document.getElementById('expDateError').textContent = 'Please use MM/YY format';
            isValid = false;
        }
        
        if (cvv.value.trim() === '') {
            document.getElementById('cvvError').textContent = 'CVV is required';
            isValid = false;
        } else if (!/^\d{3,4}$/.test(cvv.value)) {
            document.getElementById('cvvError').textContent = 'CVV must be 3 or 4 digits';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Calculate delivery date (7-10 business days from now)
    function calculateDeliveryDate() {
        const today = new Date();
        
        // Add 7-10 business days (9-12 calendar days to account for weekends)
        // Randomly pick between 9-12 days for some variation
        const daysToAdd = Math.floor(Math.random() * 4) + 9;
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + daysToAdd);
        
        // Format the date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return deliveryDate.toLocaleDateString('en-US', options);
    }
    
    // Show the confirmation modal
    function showConfirmationModal() {
        // Set delivery date
        deliveryDateElement.textContent = calculateDeliveryDate();
        
        // Set customer email
        customerEmailElement.textContent = document.getElementById('email').value;
        
        // Show the modal
        modal.style.display = 'block';
    }
    
    // Handle form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate the form
        if (validateForm()) {
            // If valid, show the confirmation modal
            showConfirmationModal();
            
            // Clear session storage
            sessionStorage.removeItem('currentOrder');
        }
    });
    
    // Close the modal when the X is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close the modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Return to store button
    returnToStoreButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Load order details when the page loads
    loadOrderDetails();
});
