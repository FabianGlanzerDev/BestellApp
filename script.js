// convert price text like "13.99€" into a number
function convertPrice(text) {
    let newText = text.replace("€", "");
    newText = newText.replace(",", ".");
    newText = newText.trim();
    return Number(newText);
}
// display number again as Euros
function formatPrice(number) {
    return number.toFixed(2).replace(".", ",") + " €";
}
// add item to cart
function addToBasket(dish) {
    let name = dish.querySelector("h3").innerText;
    let priceText = dish.querySelector("span:last-of-type").innerText;
    let price = convertPrice(priceText);
    let id = name; //  name to ID
    if (!basket[id]) {
        basket[id] = {
            name: name,
            price: price,
            amount: 1
        };
    } else {
        basket[id].amount++;
    }
    showBasket();
}
// Change quantity
function changeAmount(id, value) {
    basket[id].amount += value;

    if (basket[id].amount <= 0) {
        delete basket[id];
    }

    showBasket();
}
// Calculate delivery costs
function getDeliveryCost() {
    if (Object.keys(basket).length === 0) {
        return 0;
    }

    if (deliverySwitch.checked) {
        return 5;
    }

    return 0;
}
// Show shopping cart
function showBasket() {
    basketItems.innerHTML = "";
    let subtotal = 0;
    for (let id in basket) {
        let item = basket[id];
        let linePrice = item.price * item.amount;
        subtotal += linePrice;

        basketItems.innerHTML += `
            <div class="basket-item">
                <div>
                    <b>${item.name}</b><br>
                    ${formatPrice(item.price)}
                </div>
                <div>
                    <button onclick="changeAmount('${id}', -1)">-</button>
                    ${item.amount}
                    <button onclick="changeAmount('${id}', 1)">+</button>
                    <br>
                    ${formatPrice(linePrice)}
                </div>
            </div>
        `;
    }
    let delivery = getDeliveryCost();
    let total = subtotal + delivery;
    subtotalText.innerText = formatPrice(subtotal);
    deliveryText.innerText = formatPrice(delivery);
    totalText.innerText = formatPrice(total);
}
// click on the + buttons
document.querySelectorAll(".order-button").forEach(button => {
    button.addEventListener("click", function (event) {
        let btn = event.target.closest(".order-button");
        let dish = btn.closest(".dish-groupe");
        addToBasket(dish);
    });
});
// when switching between pickup and delivery
deliverySwitch.addEventListener("change", function () {
    showBasket();
});
// alert, click order button
let orderBtn = document.querySelector(".basket-order-btn");
orderBtn.addEventListener("click", function () {
    if (Object.keys(basket).length === 0) {
        alert("Dein Warenkorb ist leer!");
    } else {
        alert("Danke für deine Bestellung! Deine Bestellung wird jetzt vorbereitet.");

        // empty shopping cart
        basket = {};

        // update UI
        showBasket();
    }
});
// startup display
showBasket();





