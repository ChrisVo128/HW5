// Christopher Vo

$(document).ready(function () {
    // Handle month selection
    $("#monthSelect").change(function() {
        const monthNumber = $(this).val(); // This will get the numeric value

        // Send request to get orders for selected month
        $.ajax({
            url: '/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ month: parseInt(monthNumber) }),
            success: function(data) {
                // Clear existing orders
                $('#orderResults').empty();
                
                if (data.orders && data.orders.length > 0) {
                    let html = '<h3>Orders:</h3><ul>';
                    
                    // Add each order to the list
                    data.orders.forEach(function(order) {
                        html += `<li>${order.quantity} ${order.topping} cheesecake(s) ${order.notes ? '- Notes: ' + order.notes : ''}</li>`;
                    });
                    
                    html += `</ul><h3>Total: $${data.total}</h3>`;
                    $('#orderResults').html(html);
                } else {
                    $('#orderResults').html('<p>No orders for this month</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('Error fetching orders. Please try again.');
            }
        });
    });

    // Handle order submission
    $("#order-button").click(function () {
        const topping = $("input[name='flavor']:checked").val();
        const quantity = $("#quantity").val();
        const notes = $("#notes").val();

        // Validate inputs
        if (!topping) {
            alert("Please select a topping");
            return;
        }

        if (notes.toLowerCase().includes("vegan")) {
            alert("Warning: The cheesecakes contain dairy.");
            return;
        }

        // Send order to server
        $.ajax({
            url: '/neworder',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                topping: topping,
                quantity: parseInt(quantity),
                notes: notes
            }),
            success: function(response) {
                // Show success message and clear form
                $("#order-form").html(`
                    <p>Thank you! Your order has been placed.</p>
                    <p><strong>Topping:</strong> ${topping}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Notes:</strong> ${notes || "None"}</p>
                `);
                
                // Remove selection sections
                $("#quantity-section").remove();
                $("#topping-section").remove();

                // Refresh the current month's orders
                $("#monthSelect").trigger('change');
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('Error placing order. Please try again.');
            }
        });
    });

    // Trigger month selection on page load to show initial orders
    $("#monthSelect").trigger('change');
});
