// Christopher Vo

$(document).ready(function () {
    // Function to load orders for a month
    function loadOrders(month) {
        $.ajax({
            url: '/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ month: month }),
            success: function(data) {
                // Clear existing orders
                $('ul').empty();
                
                if (data.orders && data.orders.length > 0) {
                    data.orders.forEach(function(order) {
                        $('ul').append(`<li>${order.quantity} ${order.topping} ${order.notes ? '- Notes: ' + order.notes : ''}</li>`);
                    });
                    $('ul').append(`<li><strong>Total: $${data.total}</strong></li>`);
                } else {
                    $('ul').append('<li>No orders for this month</li>');
                }
            },
            error: function() {
                alert('Error fetching orders. Please try again.');
            }
        });
    }

    // Handle month selection
    $("#monthSelect").change(function() {
        const month = $(this).val();
        loadOrders(month);
    });

    // Handle order submission
    $("#order-button").click(function () {
        const topping = $("input[name='flavor']:checked").val();
        const quantity = $("#quantity").val();
        const notes = $("#notes").val();
        const selectedMonth = $("#monthSelect").val(); // Get currently selected month

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
                quantity: quantity,
                notes: notes,
                month: selectedMonth // Send selected month
            }),
            success: function(response) {
                $("#order-form").html(`
                    <p>Thank you! Your order has been placed.</p>
                    <p><strong>Topping:</strong> ${topping}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Notes:</strong> ${notes || "None"}</p>
                `);
                
                $("#quantity-section").remove();
                $("#topping-section").remove();

                // Refresh the orders display for current month
                loadOrders(selectedMonth);
            },
            error: function() {
                alert('Error placing order. Please try again.');
            }
        });
    });

    // Load initial orders for first month
    loadOrders(1);
});
