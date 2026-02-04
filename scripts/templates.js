function dishTemplate(dish) {
  const priceFormatted =
    dish.price.toFixed(2).replace(".", ",") + " €";

  return `
    <div class="dish-groupe" data-id="${dish.id}">
      <h3>${dish.name}</h3>

      <p>${dish.desc}</p>

      <span class="dish-price">${priceFormatted}</span>

      <button 
        class="order-button"
        type="button"
        aria-label="${dish.name} in den Warenkorb legen">
        <img src="./assets/img/icons-plus-order.png" alt="">
      </button>
    </div>
  `;
}

function basketItemTemplate(id, item) {
  const linePrice = item.price * item.amount;

  return `
    <div class="basket-item">
      <div class="basket-item-left">
        <div class="basket-item-name">${item.name}</div>
        <div class="basket-item-price">${formatPrice(item.price)}</div>
      </div>

      <div class="basket-item-right">
        <button class="basket-qty-btn" data-id="${id}" data-delta="-1" type="button" aria-label="${item.name} weniger">-</button>
        <span class="basket-qty">${item.amount}</span>
        <button class="basket-qty-btn" data-id="${id}" data-delta="1" type="button" aria-label="${item.name} mehr">+</button>
        <div class="basket-line-total">${formatPrice(linePrice)}</div>
      </div>
    </div>
  `;
}


