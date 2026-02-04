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
    if (!mainListEl || !drinksListEl || !dessertListEl) return;
    if (!Array.isArray(DISHES)) return;
    if (typeof dishTemplate !== "function") return;

    mainListEl.innerHTML = "";
    drinksListEl.innerHTML = "";
    dessertListEl.innerHTML = "";

    DISHES.forEach(dish => {
        if (dish.category === "main") {
            mainListEl.innerHTML += dishTemplate(dish);
        }
        if (dish.category === "drinks") {
            drinksListEl.innerHTML += dishTemplate(dish);
        }
        if (dish.category === "dessert") {
            dessertListEl.innerHTML += dishTemplate(dish);
        }
    });
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


// baskte logik

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
        updateTotals(0);
        return;
    }

    let html = "";

    ids.forEach((id) => {
        const item = basket[id];
        subtotal += item.price * item.amount;
        html += basketItemTemplate(id, item);
    });

    basketItems.innerHTML = html;
    updateTotals(subtotal);
}

function getDeliveryCost() {
    if (Object.keys(basket).length === 0) return 0;
    return deliverySwitch && deliverySwitch.checked ? 5 : 0;
}

function updateTotals(subtotal) {
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

document.addEventListener("DOMContentLoaded", () => {
  const orderBtn = document.querySelector(".basket-order-btn");
  const orderModal = document.querySelector("#orderModal");

  if (!orderBtn) console.warn("❌ .basket-order-btn nicht gefunden");
  if (!orderModal) console.warn("❌ #orderModal nicht gefunden");

  function openModal() {
    orderModal.classList.add("is-open");
    orderModal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    orderModal.classList.remove("is-open");
    orderModal.setAttribute("aria-hidden", "true");
  }

  // Schließen per Klick (Overlay, X, Ok)
  orderModal?.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") closeModal();
  });

  // Schließen per ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && orderModal?.classList.contains("is-open")) closeModal();
  });

  // Bestellen
  orderBtn?.addEventListener("click", () => {
    if (Object.keys(basket).length === 0) {
      alert("Dein Warenkorb ist leer!");
      return;
    }

    // Warenkorb leeren + UI updaten
    basket = {};
    showBasket();

    // Popup zeigen
    openModal();
  });
});


// start !

renderDishes();
showBasket();







