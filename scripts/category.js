const productsHTML = document.querySelector(".products");
const categoryCards = document.querySelectorAll(".category-cards .card");
const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");

const checkOutBtn = document.querySelector(".checkOut");

checkOutBtn.addEventListener("click", () => {
  window.location.href = `ordering.html`;
});

let carts = [];
let products = [];
let selectCategory = [];

const updateCategoryCards = () => {
  categoryCards.forEach((card) => {
    if (selectCategory.includes(card.id)) {
      // console.log(`ID: ${card.id} อยู่ใน selectCategory`);
      card.classList.add("active");
    } else {
      // console.log(`ID: ${card.id} ไม่อยู่ใน selectCategory`);
      card.classList.remove("active");
    }
  });
};

categoryCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    let cateID = e.target.closest(".card").id;
    // console.log(`Click on ${category}`);
    if (selectCategory.includes(cateID)) {
      // console.log(`Remove ${cateID}`);
      const index = selectCategory.indexOf(cateID);
      if (index >= 0) {
        // ลบค่าจาก array ตาม index ที่พบ
        selectCategory.splice(index, 1);
      }
    } else {
      // console.log(`Add ${cateID}`);
      selectCategory.push(cateID);
    }
    // localStorage.setItem("selectCategory", JSON.stringify(selectCategory));
    updateCategoryCards();
    filterProducts();
    localStorage.setItem("selectCategory", JSON.stringify(selectCategory));
  });
});

// ฟังก์ชันสำหรับการแสดงสินค้าในหน้า HTML
const displayProducts = (filteredProducts) => {
  // เคลียร์สินค้าทั้งหมดก่อนแสดงรายการใหม่
  productsHTML.innerHTML = "";

  // ตรวจสอบว่ามีสินค้าตามหมวดหมู่ที่เลือกหรือไม่
  if (filteredProducts.length === 0) {
    productsHTML.innerHTML = "<p>No products available in this category.</p>";
  } else {
    // สร้าง HTML ของสินค้าตามข้อมูลที่ได้รับ
    filteredProducts.forEach((product) => {
      productsHTML.innerHTML += `
      <div class="product-card">
        <button class="add-card" id='${product.id}' onclick='addCard(event)'>
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_429_10970)">
              <circle
                cx="12"
                cy="11.999"
                r="9"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 9V15"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 12H15"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_429_10970">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        <div class="card-color"></div>
        <img src="${product.image}" alt="${product.name}" />
        <div class="details">
          <h3>${product.name}</h3>
          <p>฿${product.price.toLocaleString()}</p>
          <a href="${product.link}"><span>More Info</span></a>
        </div>
      </div>`;
    });
  }
};


function addCard(e) {
  const productId = e.target.closest('button').id;
  // console.log(productId); // แสดงค่า id ใน console
  addToCard(productId);
}

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

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
}

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

// ฟังก์ชันกรองสินค้าตามหมวดหมู่ที่เลือกใน selectCategory
const filterProducts = () => {
  // แปลง selectCategory เป็นหมวดหมู่ที่ต้องการกรองจาก products.json
  const selectedCategories = selectCategory.map((category) => {
    switch (category) {
      case "electronics":
        return "Electronic";
      case "computers-assesories":
        return "Computer";
      case "home-appliances":
        return "Appliance";
      default:
        return "";
    }
  });

  // กรองสินค้าโดยหมวดหมู่ที่เลือก
  const filteredProducts = products.filter((product) =>
    selectedCategories.includes(product.category)
  );
  displayProducts(filteredProducts);
};

const initApp = () => {
  // if (localStorage.getItem("selectCategory")) {
  //   selectCategory = JSON.parse(localStorage.getItem("selectCategory"));
  // }
  updateCategoryCards();
  fetch("scripts/products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      filterProducts();

      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCardToHTML();
      }
      if (localStorage.getItem("selectCategory")) {
        selectCategory = JSON.parse(localStorage.getItem("selectCategory"));
        updateCategoryCards();
        filterProducts();
      }
    });
};

initApp();
