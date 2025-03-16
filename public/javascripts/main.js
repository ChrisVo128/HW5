// Christopher Vo

$(document).ready(function () {
    // Function to load and display orders for a month
    function loadOrders(month) {
        $.ajax({
            url: '/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ month: month }),
            success: function(data) {
                const orderResults = $('ul');  // or whatever container you're using
                orderResults.empty();
                
                if (data.orders && data.orders.length > 0) {
                    data.orders.forEach(function(order) {
                        orderResults.append(`<li>${order.quantity} ${order.topping} ${order.notes ? '- Notes: ' + order.notes : ''}</li>`);
                    });
                    orderResults.append(`<li><strong>Total: $${data.total}</strong></li>`);
                } else {
                    orderResults.append('<li>No orders for this month</li>');
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
        const selectedMonth = $("#monthSelect").val();

        if (!topping) {
            alert("Please select a topping");
            return;
        }

        if (notes.toLowerCase().includes("vegan")) {
            alert("Warning: The cheesecakes contain dairy.");
            return;
        }

        $.ajax({
            url: '/neworder',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                topping: topping,
                quantity: quantity,
                notes: notes,
                month: selectedMonth
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

                // Reload orders for the current month after placing order
                loadOrders(selectedMonth);
            },
            error: function() {
                alert('Error placing order. Please try again.');
            }
        });
    });

    // Load initial orders when page loads
    const initialMonth = $("#monthSelect").val();
    loadOrders(initialMonth);
});
