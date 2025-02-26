// Christopher Vo

$(document).ready(function () {
            // Change the selected month in the dropdown when a month is clicked
            $(".dropdown-content a").click(function (e) {
                e.preventDefault();
                const selectedMonth = $(this).text();
                $(".dropbtn").text(selectedMonth);
            });
            
            // Handle the order button click
            $("#order-button").click(function () {
                // Get the selected flavor, quantity, and notes
                const flavor = $("input[name='flavor']:checked").val();
                const quantity = $("#quantity").val();
                const notes = $("#notes").val().toLowerCase();
                
                // Display a warning if "vegan" is mentioned
                if (notes.includes("vegan")) {
                    alert("Warning: The cheesecakes contain dairy.");
                    return;
                }
                
                // Remove quantity and topping sections after order
                $("#quantity-section").remove();
                $("#topping-section").remove();
                
                // Display the order details
                const orderDetails = `
                    <p>Thank you! Your order has been placed.</p>
                    <p><strong>Topping:</strong> ${flavor}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Notes:</strong> ${notes || "None"}</p>
                `;
                
                $("#order-form").html(orderDetails);
            });
        });
