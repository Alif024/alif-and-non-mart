window.addEventListener("scroll", function () {
  var navbar = document.querySelector("nav.sticky-top");
  if (window.scrollY > 0) {
    // กำหนดตำแหน่งที่ต้องการให้เพิ่มคลาส (ในกรณีนี้คือเมื่อเลื่อนลงมา 50px)
    navbar.classList.add("scroll"); // เพิ่มคลาส highlight
  } else {
    navbar.classList.remove("scroll"); // เอาคลาส highlight ออก
  }
});

function updatePrice(value) {
  // Calculate the price based on the input value
  var price = value * 100;
  
  // Update the price in the table
  document.getElementById('price').innerText = '$' + price;
}
