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
