const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");
const productsReccomendHTML = document.querySelector("#products-recommend");
const electronics = document.querySelector("#electronics");
const computersAssesories = document.querySelector("#computers-assesories");
const homeAppliances = document.querySelector("#home-appliances");

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

const addProductRecToHTML = () => {
  productsReccomendHTML.innerHTML = "";
  let countGen = 0;
  products.forEach((product) => {
    if (countGen > 8) {
      return;
    }
    let newProduct = document.createElement("div");
    if (countGen != 8) {
      newProduct.classList.add("card");
      
    } else {
      newProduct.classList.add("card");
      newProduct.classList.add("card-last");
    }
    newProduct.dataset.id = product.id;
    newProduct.innerHTML = `
      <div class="img">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="details">
        <h3>${product.name}</h3>
        <p>฿${product.price.toLocaleString()}</p>
        <a href="${product.link}"><span>More Info</span></a>
      </div>
    `;
    productsReccomendHTML.appendChild(newProduct);
    countGen++;
  });
};

let currentImage = 1;

const swapImage = () => {
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    
    if (currentImage === 1) {
        image1.classList.remove('show');
        image2.classList.add('show');
        currentImage = 2;
    } else {
        image2.classList.remove('show');
        image1.classList.add('show');
        currentImage = 1;
    }
}

// สลับรูปภาพทุก 3 วินาที
setInterval(swapImage, 3000);


const initApp = () => {
  fetch("scripts/products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;

      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCardToHTML();
      }

      addProductRecToHTML();
    });
};

initApp();