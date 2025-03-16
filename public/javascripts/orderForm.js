// Christopher Vo

// function to handle form submission
function submitOrder(event) {
    event.preventDefault();
    
    const quantity = document.getElementById('quantity').value;
    const topping = document.getElementById('topping').value;
    const notes = document.getElementById('notes').value;

    // send order to server
    fetch('/neworder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity: quantity,
            topping: topping,
            notes: notes
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Order processed successfully!');
            
            document.getElementById('orderform').reset();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to process order');
    });
}

// add event listener to form
document.getElementById('orderform').addEventListener('submit', submitOrder);