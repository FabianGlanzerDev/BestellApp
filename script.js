// prices
function convertPrice(text) {
    let newText = text.replace("€", "").trim();
    newText = newText.replace(/\s/g, "");
    newText = newText.replace(",", ".");
    return Number(newText) || 0;
}

function formatPrice(number) {
    return number.toFixed(2).replace(".", ",") + " €";
}

// basket
let basket = {};

// dom
const basketItems = document.querySelector(".basket-items");
const subtotalText = document.querySelector(".basket-subtotal");
const deliveryText = document.querySelector(".basket-delivery-cost");
const totalText = document.querySelector(".basket-total-value");
const deliverySwitch = document.querySelector(".basket-switch input");
const orderBtn = document.querySelector(".basket-order-btn");

// Lists for dishes
const mainListEl = document.querySelector("#main-list");
const drinksListEl = document.querySelector("#drinks-list");
const dessertListEl = document.querySelector("#dessert-list");

// render dishes
function renderDishes() {
    if (!mainListEl || !drinksListEl || !dessertListEl) {
        console.warn("Listen-Container fehlen (main-list / drinks-list / dessert-list).");
        return;
    }
    // clear lists
    mainListEl.innerHTML = "";
    drinksListEl.innerHTML = "";
    dessertListEl.innerHTML = "";

    if (typeof DISHES === "undefined") {
        console.error("DISHES ist undefined → db.js wird nicht korrekt geladen oder Reihenfolge falsch.");
        return;
    }

    if (typeof dishTemplate !== "function") {
        console.error("dishTemplate() fehlt → templates.js wird nicht korrekt geladen oder Reihenfolge falsch.");
        return;
    }
    // render to the correct category
    DISHES.forEach((dish) => {
        if (dish.category === "main") {
            mainListEl.innerHTML += dishTemplate(dish);
        } else if (dish.category === "drinks") {
            drinksListEl.innerHTML += dishTemplate(dish);
        } else if (dish.category === "dessert") {
            dessertListEl.innerHTML += dishTemplate(dish);
        }
    });
}
// baskte logikj
function addToBasket(dishEl) {
    if (!dishEl) return;

    const id = dishEl.dataset.id || dishEl.querySelector("h3")?.innerText.trim();
    const name = dishEl.querySelector("h3")?.innerText.trim() || "Unbekannt";
    const priceText = dishEl.querySelector("span:last-of-type")?.innerText || "0";
    const price = convertPrice(priceText);

    if (!basket[id]) {
        basket[id] = { name, price, amount: 1 };
    } else {
        basket[id].amount++;
    }

    showBasket();
}

function changeAmount(id, value) {
    if (!basket[id]) return;

    basket[id].amount += value;

    if (basket[id].amount <= 0) {
        delete basket[id];
    }

    showBasket();
}

function getDeliveryCost() {
    if (Object.keys(basket).length === 0) return 0;
    return deliverySwitch && deliverySwitch.checked ? 5 : 0;
}
// rendewr basket
function showBasket() {
    basketItems.innerHTML = "";

    let subtotal = 0;
    const ids = Object.keys(basket);

    if (ids.length === 0) {
        basketItems.innerHTML = `<div class="basket-empty">Noch leer</div>`;
    } else {
        ids.forEach((id) => {
            const item = basket[id];
            const linePrice = item.price * item.amount;
            subtotal += linePrice;

            basketItems.innerHTML += `
        <div class="basket-item">
          <div class="basket-item-left">
            <div class="basket-item-name">${item.name}</div>
            <div class="basket-item-price">${formatPrice(item.price)}</div>
          </div>

          <div class="basket-item-right">
            <button class="basket-qty-btn" data-id="${id}" data-delta="-1" type="button">-</button>
            <span class="basket-qty">${item.amount}</span>
            <button class="basket-qty-btn" data-id="${id}" data-delta="1" type="button">+</button>
            <div class="basket-line-total">${formatPrice(linePrice)}</div>
          </div>
        </div>
      `;
        });
    }

    const delivery = getDeliveryCost();
    const total = subtotal + delivery;

    subtotalText.innerText = formatPrice(subtotal);
    deliveryText.innerText = formatPrice(delivery);
    totalText.innerText = formatPrice(total);
}
// Click on the plus sign next to the dishes.
document.addEventListener("click", (event) => {
    const btn = event.target.closest(".order-button");
    if (!btn) return;

    const dish = btn.closest(".dish-groupe");
    addToBasket(dish);
});
// +/- basket
basketItems.addEventListener("click", (event) => {
    const btn = event.target.closest(".basket-qty-btn");
    if (!btn) return;

    const id = btn.dataset.id;
    const delta = Number(btn.dataset.delta);
    changeAmount(id, delta);
});
// change delivery
if (deliverySwitch) {
    deliverySwitch.addEventListener("change", () => showBasket());
}
// order
if (orderBtn) {
    orderBtn.addEventListener("click", () => {
        if (Object.keys(basket).length === 0) {
            alert("Dein Warenkorb ist leer!");
            return;
        }

        alert("Danke für deine Bestellung! Deine Bestellung wird jetzt vorbereitet.");
        basket = {};
        showBasket();
    });
}
// start !
renderDishes();
showBasket();







