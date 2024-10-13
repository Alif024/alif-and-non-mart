const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");
const productsReccomendHTML = document.querySelector("#products-recommend");

let carts = [];
let products = [];

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addToCard = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity += 1;
  }
  addCardToHTML();
  addCartToMemory();
};

const addCardToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = products.findIndex((value) => value.id == cart.product_id);
      let info = products[positionProduct];
      newCart.innerHTML = `
        <div class="image">
          <img src="${info.image}" alt="">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">฿${(info.price * cart.quantity).toLocaleString()}</div>
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
  let positionClick = e.target;
  if (positionClick.classList.contains("minus")) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let positionThisProductInCart = carts.findIndex(
      (value) => value.product_id == product_id
    );
    if (carts[positionThisProductInCart].quantity > 1) {
      carts[positionThisProductInCart].quantity -= 1;
    } else {
      carts.splice(positionThisProductInCart, 1);
    }
    addCardToHTML();
    addCartToMemory();
  } else if (positionClick.classList.contains("plus")) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    addToCard(product_id);
  }
});


const listProducts = document.querySelector(".list-products");
const totalQuantityHTML = document.querySelectorAll("#total-quantity");
const totalPriceHTML = document.querySelectorAll("#total-price");
const discount = document.querySelector("#discount");
const shippingCosts = document.querySelector("#shipping-costs");
const netPrice = document.querySelector("#net-price");

const updateProductOrder = (totalQuantity, totalPrice) => {
  if (totalQuantityHTML !== null) {
    totalQuantityHTML.forEach((element) => {
      element.innerText = totalQuantity;
    });
  }
  if (totalPriceHTML !== null) {
    totalPriceHTML.forEach((element) => {
      element.innerText = `฿${totalPrice.toLocaleString()}`;
    });
  }
  let Discount = parseFloat(discount.textContent.replace('-', '').replace('฿', '')) || 0;
  let ShippingCosts = parseFloat(shippingCosts.textContent.replace('฿', '')) || 0;
  if ((totalPrice - Discount + ShippingCosts) <= 0) {
    netPrice.innerText = `฿0`;
  } else {
    netPrice.innerText = `฿${(totalPrice - Discount + ShippingCosts).toLocaleString()}`;
  }
};

const minus = (id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == id
  );
  if (carts[positionThisProductInCart].quantity > 1) {
    carts[positionThisProductInCart].quantity -= 1;
  } else {
    carts.splice(positionThisProductInCart, 1);
  }
  addProductToHTML();
  addCartToMemory();
  addCardToHTML();
  updateProductOrder(totalQuantity, totalPrice);
}

const plus = (id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == id
  );
  carts[positionThisProductInCart].quantity += 1;
  addProductToHTML();
  addCartToMemory();
  addCardToHTML();
  updateProductOrder(totalQuantity, totalPrice);
}

const addProductToHTML = () => {
  listProducts.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      totalPrice += products.find((value) => value.id == cart.product_id).price * cart.quantity;
      let newProduct = document.createElement("tr");
      newProduct.dataset.id = cart.product_id;   

      let productNameAndImg = document.createElement("td");
      let positionProduct = products.findIndex((value) => value.id == cart.product_id);
      let info = products[positionProduct];     
      productNameAndImg.innerHTML = `
        <div class="d-flex align-items-center">
          <img
            src="${info.image}"
            alt="Product"
            class="me-3"
            style="width: 100px"
          />
          <div>
            <p class="mb-1">${info.name}</p>
          </div>
        </div>
      `;
      newProduct.appendChild(productNameAndImg);

      let productPrice = document.createElement("td");
      productPrice.classList.add("text-center");
      productPrice.innerText = `฿${info.price.toLocaleString()}`;
      newProduct.appendChild(productPrice);

      let productQuantity = document.createElement("td");
      productQuantity.classList.add("text-center");
      productQuantity.innerHTML = `
        <div class="d-inline-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary" onclick="minus(${info.id})">
            -
          </button>
          <span class="mx-2">${cart.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="plus(${info.id})">
            +
          </button>
        </div>
      `;
      newProduct.appendChild(productQuantity);
      listProducts.appendChild(newProduct);
    });
  }
  updateProductOrder(totalQuantity, totalPrice);
}

function ordering() {
  // ตรวจสอบการกรอกฟอร์มที่อยู่จัดส่ง
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const province = document.getElementById('province').value;
  const zipcode = document.getElementById('zipcode').value;
  const phone = document.getElementById('phone').value;
  
  if (name && address && province && zipcode && phone && carts.length > 0) {
    // แสดง Bootstrap modal
    var orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();
    carts = [];
    addProductToHTML();
    addCartToMemory();
    addCardToHTML();

    // ล้างฟอร์มที่อยู่จัดส่ง
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('province').value = '';
    document.getElementById('zipcode').value = '';
    document.getElementById('phone').value = '';
  } else if (carts.length === 0) {
    alert("กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ");
  } else {
    alert("กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน");
  }
}

const initPage = () => {
  fetch("scripts/products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;

      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCardToHTML();
        addProductToHTML();
      }
    });
}

initPage();