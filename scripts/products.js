const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");

let carts = [];
let products = [];

let slideIndex = 1;
showProductSlides(slideIndex);

function plusSlides(n) {
  showProductSlides(slideIndex += n);
}

function currentProductImg(n) {
  showProductSlides((slideIndex = n));
}

function showProductSlides(n) {
  let i;
  let slides = document.getElementsByClassName("products-img-slide");
  let dots = document.getElementsByClassName("img-slide");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

let productQuantity = 1;

function plusQuantity(n) {
  productQuantity += n;
  if (productQuantity < 1) {
    productQuantity = 1;
  }
  document.getElementById("product-quantity").value = productQuantity;
}

const inputQuantity = document.getElementById("product-quantity");
inputQuantity.addEventListener("input", function () {
  if (this.value < 1) {
    this.value = 1;
  }
  productQuantity = parseInt(this.value);
});

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
          <img src="../${info.image}" alt="">
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

const addProduct = (id) => {
  let totalQuantity = parseFloat(inputQuantity.value);
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: id,
        quantity: totalQuantity,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: id,
      quantity: totalQuantity,
    });
  } else {
    carts[positionThisProductInCart].quantity += totalQuantity;
  }
  addCardToHTML();
  addCartToMemory();
}

const initApp = () => {
  fetch("../scripts/products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;

      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCardToHTML();
      }
    });
};

initApp();