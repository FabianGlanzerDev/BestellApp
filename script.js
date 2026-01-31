// Preistext wie "13,99€" in eine Zahl umwandeln
function convertPrice(text) {
    let newText = text.replace("€", "");
    newText = newText.replace(",", ".");
    newText = newText.trim();
    return Number(newText);
}

// Zahl wieder als Euro anzeigen
function formatPrice(number) {
    return number.toFixed(2).replace(".", ",") + " €";
}

// Warenkorb als Objekt speichern
let basket = {};

// Elemente vom Warenkorb holen
let basketItems = document.querySelector(".basket-items");
let subtotalText = document.querySelector(".basket-subtotal");
let deliveryText = document.querySelector(".basket-delivery-cost");
let totalText = document.querySelector(".basket-total-value");

let deliverySwitch = document.querySelector(".basket-switch input");

// Artikel zum Warenkorb hinzufügen
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

// Menge ändern
function changeAmount(id, value) {
    basket[id].amount += value;

    if (basket[id].amount <= 0) {
        delete basket[id];
    }

    showBasket();
}

// Lieferkosten berechnen
function getDeliveryCost() {
    if (Object.keys(basket).length === 0) {
        return 0;
    }

    if (deliverySwitch.checked) {
        return 5;
    }

    return 0;
}

// Warenkorb anzeigen
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

// Klick auf die + Buttons
document.querySelectorAll(".order-button").forEach(button => {
    button.addEventListener("click", function (event) {
        let btn = event.target.closest(".order-button");
        let dish = btn.closest(".dish-groupe");
        addToBasket(dish);
    });
});

// Wenn Abholen/Liefern gewechselt wird
deliverySwitch.addEventListener("change", function () {
    showBasket();
});

// alert, klick order Button 

let orderBtn = document.querySelector(".basket-order-btn");

orderBtn.addEventListener("click", function () {

    if (Object.keys(basket).length === 0) {
        alert("Dein Warenkorb ist leer!");
    } else {
        alert("Danke für deine Bestellung! Deine Bestellung wird jetzt vorbereitet.");

        // Warenkorb leeren
        basket = {};

        // UI aktualisieren
        showBasket();
    }

});




// Startanzeige
showBasket();





