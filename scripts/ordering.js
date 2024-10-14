const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");
const checkOutBtn = document.querySelector(".checkOut");

let carts = [];
let products = [];

checkOutBtn.addEventListener("click", () => {
  window.location.href = `#`;
});

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addToCart = (product_id) => {
  const cartItem = carts.find(cart => cart.product_id == product_id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  }
  updateCartAndProductViews();
};

const updateCartAndProductViews = () => {
  addCardToHTML();
  addProductToHTML();
  addCartToMemory();
};

const addCardToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      const product = products.find(p => p.id == cart.product_id);
      if (!product) return;

      const newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      newCart.innerHTML = `
        <div class="image">
          <img src="${product.image}" alt="">
        </div>
        <div class="name">${product.name}</div>
        <div class="totalPrice">฿${(product.price * cart.quantity).toLocaleString()}</div>
        <div class="quantity">
          <span class="minus"><</span>
          <span>${cart.quantity}</span>
          <span class="plus">></span>
        </div>
      `;
      listCartHTML.appendChild(newCart);
    });
  }
  iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener("click", (e) => {
  const target = e.target;
  const product_id = target.closest(".item")?.dataset.id;
  
  if (target.classList.contains("minus")) {
    updateCartQuantity(product_id, -1);
  } else if (target.classList.contains("plus")) {
    updateCartQuantity(product_id, 1);
  }
});

const updateCartQuantity = (product_id, amount) => {
  const cartItem = carts.find(cart => cart.product_id == product_id);
  if (!cartItem) return;
  
  cartItem.quantity += amount;
  if (cartItem.quantity <= 0) {
    carts = carts.filter(cart => cart.product_id != product_id);
  }
  updateCartAndProductViews();
};

const listProducts = document.querySelector(".list-products");
const totalQuantityHTML = document.querySelectorAll("#total-quantity");
const totalPriceHTML = document.querySelectorAll("#total-price");
const discount = document.querySelector("#discount");
const shippingCosts = document.querySelector("#shipping-costs");
const netPrice = document.querySelector("#net-price");

const updateProductOrder = (totalQuantity, totalPrice) => {
  totalQuantityHTML.forEach(el => el.innerText = totalQuantity);
  totalPriceHTML.forEach(el => el.innerText = `฿${totalPrice.toLocaleString()}`);

  const Discount = parseFloat(discount.textContent.replace('-', '').replace('฿', '')) || 0;
  const ShippingCosts = parseFloat(shippingCosts.textContent.replace('฿', '')) || 0;
  const finalPrice = Math.max(0, totalPrice - Discount + ShippingCosts);
  netPrice.innerText = `฿${finalPrice.toLocaleString()}`;
};

const addProductToHTML = () => {
  listProducts.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;

  if (carts.length > 0) {
    carts.forEach(cart => {
      const product = products.find(p => p.id == cart.product_id);
      if (!product) return;

      totalQuantity += cart.quantity;
      totalPrice += product.price * cart.quantity;

      const newProduct = document.createElement("tr");
      newProduct.dataset.id = cart.product_id;
      newProduct.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <img src="${product.image}" alt="Product" class="me-3" style="width: 100px" />
            <div><p class="mb-1">${product.name}</p></div>
          </div>
        </td>
        <td class="text-center">฿${product.price.toLocaleString()}</td>
        <td class="text-center">
          <div class="d-inline-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${product.id}, -1)">-</button>
            <span class="mx-2">${cart.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${product.id}, 1)">+</button>
          </div>
        </td>
      `;
      listProducts.appendChild(newProduct);
    });
  }

  updateProductOrder(totalQuantity, totalPrice);
};

function ordering() {
  const name = document.getElementById('name');
  const address = document.getElementById('address');
  const province = document.getElementById('province');
  const zipcode = document.getElementById('zipcode');
  const phone = document.getElementById('phone');
  const cardNumber = document.getElementById('cardNumber');
  const cardName = document.getElementById('cardName');
  const expiryDate = document.getElementById('expiryDate');
  const cvv = document.getElementById('cvv');
  
  if (name.value && address.value && province.value && zipcode.value && phone.value && carts.length > 0 && cardNumber.value && cardName.value && expiryDate.value && cvv.value) {
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();

    carts = [];
    updateCartAndProductViews();

    name.value = "";
    address.value = "";
    province.value = "";
    zipcode.value = "";
    phone.value = "";
    cardNumber.value = "";
    cardName.value = "";
    expiryDate.value = "";
    cvv.value = "";
  } else {
    alert(carts.length === 0 ? "กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ" : "กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน");
  }
}


const initPage = () => {
  fetch("scripts/products.json")
    .then(response => response.json())
    .then(data => {
      products = data;
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        updateCartAndProductViews();
      }
    });
};

initPage();
