const cart = {};  // เก็บข้อมูลสินค้าที่เลือก
let totalPrice = 0;

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-product-id');
    const price = parseInt(button.getAttribute('data-price'));

    // ตรวจสอบว่าราคาถูกต้อง
    if (isNaN(price)) {
      console.error("Invalid price for product ID:", productId);
      return; // ไม่ดำเนินการต่อถ้าราคาผิด
    }

    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay(); // อัปเดตการแสดงผลของตะกร้า
    updateCartAmount();  // อัปเดตจำนวนสินค้ารวม
  });
});

function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  totalPrice = 0;

  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["สินค้า", "จำนวน", "ราคา", "ราคารวม", "ลบ"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");

    const productNameCell = document.createElement("td");
    productNameCell.textContent = `${productId}`;
    tr.appendChild(productNameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    tr.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price}`;
    tr.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `$${itemTotalPrice}`;
    tr.appendChild(totalCell);

    const actionsCell = document.createElement("td");

    // ปรับการสร้างปุ่มลบเป็นสัญลักษณ์ X
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '&#x2715;'; // สัญลักษณ์ X
    deleteButton.setAttribute("data-product-id", productId);
    deleteButton.classList.add("delete-button"); // เพิ่มคลาสสำหรับสไตล์
    deleteButton.addEventListener("click", () => {
      delete cart[productId];
      updateCartDisplay();
    });
    actionsCell.appendChild(deleteButton);
    tr.appendChild(actionsCell);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
    cartElement.appendChild(totalPriceElement);
  }
}


// ฟังก์ชันสำหรับการแสดง Overlay เมื่อคลิกที่ตะกร้า
document.getElementById("click-to-view-cart").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "flex";  // แสดง overlay
  updateCartDisplay();  // อัปเดตการแสดงผลตะกร้าใน overlay
});

// ฟังก์ชันสำหรับปิด Overlay เมื่อคลิกนอกพื้นที่ overlay
document.getElementById("overlay").addEventListener("click", (event) => {
  if (event.target === document.getElementById("overlay")) {
    document.getElementById("overlay").style.display = "none";  // ซ่อน overlay
  }
});

// ฟังก์ชันสำหรับพิมพ์ใบเสร็จ
document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Thank you!", generateCartReceiptContent());
});

// ฟังก์ชันที่ใช้สำหรับพิมพ์ใบเสร็จ
function printReceipt(title, content) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(
    `<html><head><title>${title}</title></head><body>${content}</body></html>`
  );
  printWindow.document.close();
  printWindow.print();
}

function generateCartReceiptContent() {
  let receiptContent = `
      <style>
        @page {
          size: 80mm 200mm; /* ปรับขนาดหน้าให้เหมาะสมกับสลิป */
          margin: 0;
        }
        body {
          width: 80mm;
          height: 200mm;
          margin: 0;
          padding: 0;
          font-family: 'Courier New', monospace;
        }
        .receipt-header {
          text-align: center;
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .shop-name {
          font-size: 1.5em;
          margin-bottom: 10px;
        }
        .receipt-details {
          font-size: 1em;
          text-align: center;
          margin-bottom: 10px;
        }
        .receipt-details p {
          margin: 5px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          text-align: left;
          padding: 8px;
          font-size: 1em;
        }
        th {
          border-bottom: 1px solid #000;
          text-transform: uppercase;
        }
        td {
          border-bottom: 1px solid #ddd;
        }
        .total-price {
          font-weight: bold;
          font-size: 1.2em;
          text-align: right;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          font-size: 0.9em;
          margin-top: 10px;
        }
        .footer p {
          margin: 3px 0;
        }
      </style>
      <div class="receipt-header">
        <div class="shop-name">22 SHOP</div>
        <div class="receipt-details">
          <p>Thank you for shopping with us!</p>
          <p>DATE: ${new Date().toLocaleDateString()}</p>
          <p>TIME: ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>สินค้า</th>
            <th>จำนวน</th>
            <th>ราคา</th>
            <th>ราคารวม</th>
          </tr>
        </thead>
        <tbody>`;

  let totalPrice = 0;
  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `
        <tr>
          <td>${productId}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toFixed(2)}</td>
          <td>${itemTotalPrice.toFixed(2)}</td>
        </tr>`;

    totalPrice += itemTotalPrice;
  }

  receiptContent += `
        </tbody>
      </table>
      <div class="total-price">
        Total Price: ${totalPrice.toFixed(2)}
      </div>
      <div class="footer">
        <p>Contact: Boom Tel. 222-222-2222</p>
        <p>Visit us again!</p>
      </div>
  `;

  return receiptContent;
}

function updateCartAmount() {
  let totalQuantity = 0;

  for (const productId in cart) {
    totalQuantity += cart[productId].quantity;
  }

  // แสดงจำนวนสินค้ารวมในตะกร้า
  document.getElementById("cart-amount").textContent = totalQuantity;
}
