// Function to toggle the visibility of the admin page overlay
function toggleAdminPage() {
  const adminPage = document.getElementById("admin-page");
  adminPage.classList.toggle("show");
}

// Function to toggle the visibility of the blog management overlay
function toggleBlogManagement() {
  const adminBlogPage = document.getElementById("admin-blog-page");
  adminBlogPage.classList.toggle("show");
  loadBlogs();  
}

// Function to toggle the visibility of the course management overlay
function toggleCourseManagement() {
  const adminCoursePage = document.getElementById("admin-course-page");
  adminCoursePage.classList.toggle("show");
  loadDiscountedCourses();  
}

// Function to send blog data to the server
async function addOrUpdateBlog() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const publishDate = document.getElementById("publish-date").value;

  if (!title || !content || !publishDate) {
    alert("Please fill out all fields.");
    return;
  }

  const blogData = { title, content, publishDate };

  try {
    const response = await fetch('http://localhost:3000/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData)
    });

    if (response.ok) {
      alert("Blog saved successfully!");
      document.getElementById("blog-form").reset();
      loadBlogs();  
    } else {
      alert("Failed to save the blog.");
    }
  } catch (error) {
    console.error("Error saving blog:", error);
    alert("An error occurred while saving the blog.");
  }
}

// Function to load and display blogs
async function loadBlogs() {
  try {
    const response = await fetch('http://localhost:3000/api/blogs');
    if (response.ok) {
      const blogs = await response.json();
      const blogList = document.getElementById("blog-list");
      blogList.innerHTML = "";  

      blogs.forEach(blog => {
        const blogItem = document.createElement("div");
        blogItem.classList.add("blog-card");

        const titleElement = document.createElement("h4");
        titleElement.textContent = blog.title;

        const contentElement = document.createElement("h5");
        contentElement.textContent = blog.content;

        const dateElement = document.createElement("p");
        dateElement.textContent = `Published on: ${new Date(blog.publish_date).toLocaleDateString()}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = () => deleteBlog(blog.id);

        blogItem.appendChild(titleElement);
        blogItem.appendChild(contentElement);
        blogItem.appendChild(dateElement);
        blogItem.appendChild(deleteButton);

        blogList.appendChild(blogItem);
      });
    } else {
      console.error("Failed to load blogs.");
    }
  } catch (error) {
    console.error("Error loading blogs:", error);
  }
}

// Function to delete a blog
async function deleteBlog(blogId) {
  try {
    const response = await fetch(`http://localhost:3000/api/blogs/${blogId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Blog deleted successfully!");
      loadBlogs();
    } else {
      alert("Failed to delete the blog.");
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    alert("An error occurred while deleting the blog.");
  }
}

// Function to send course data to the server
async function addCourse() {
  const title = document.getElementById("course-title").value;
  const description = document.getElementById("course-description").value;
  const actualPrice = document.getElementById("course-price").value;
  const discountPercentage = document.getElementById("course-discount").value;

  if (!title || !description || !actualPrice || !discountPercentage) {
    alert("Please fill out all fields.");
    return;
  }

  const discountedPrice = (actualPrice - (actualPrice * (discountPercentage / 100))).toFixed(2);

  const courseData = {
    title,
    description,
    actualPrice,
    discountPercentage,
    discountedPrice
  };

  try {
    const response = await fetch('http://localhost:3000/api/courses/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });

    if (response.ok) {
      alert("Course added successfully!");
      document.getElementById("course-form").reset();
      loadDiscountedCourses(); 
    } else {
      alert("Failed to add the course.");
    }
  } catch (error) {
    console.error("Error adding course:", error);
    alert("An error occurred while adding the course.");
  }
}
async function loadDiscountedCourses() {
  try {
    const response = await fetch('http://localhost:3000/api/courses/discounted');
    if (response.ok) {
      const courses = await response.json();
      const courseList = document.getElementById("course-list");
      courseList.innerHTML = "";  // Clear existing courses

      courses.forEach(course => {
        const courseItem = document.createElement("div");
        courseItem.classList.add("course-item");

        const titleElement = document.createElement("h3");
        titleElement.textContent = course.title;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = course.description;

        const priceElement = document.createElement("p");
        const discountPrice = (course.price * (1 - course.discount / 100)).toFixed(2);

        priceElement.innerHTML = `<span class="strike-through">₹${course.price}</span> <span class="discounted-price">₹${discountPrice}</span>`;

        // Create only the "Add to Cart" button
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.classList.add("add-to-cart-button");
        addToCartButton.onclick = () => addToCart(course);

        courseItem.appendChild(titleElement);
        courseItem.appendChild(descriptionElement);
        courseItem.appendChild(priceElement);
        courseItem.appendChild(addToCartButton);

        courseList.appendChild(courseItem);
      });
    } else {
      console.error("Failed to load courses.");
    }
  } catch (error) {
    console.error("Error loading courses:", error);
  }
}

// Filter courses based on search input
function filterCourses() {
  const searchTerm = document.getElementById("course-search").value.toLowerCase();
  const courses = document.querySelectorAll(".course-item");

  courses.forEach(course => {
    const title = course.querySelector("h3").textContent.toLowerCase();
    const description = course.querySelector("p").textContent.toLowerCase();
    
    // Show the course if the title or description includes the search term
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      course.style.display = "block";
    } else {
      course.style.display = "none";
    }
  });
}


function updateQuantity(course, delta) {
  const quantityDisplay = event.target.parentElement.querySelector(".quantity-display");
  let quantity = parseInt(quantityDisplay.textContent);
  quantity = Math.max(0, quantity + delta); // Prevent negative quantities
  quantityDisplay.textContent = quantity;
}

let cart = []; // Cart items

// Function to add items to the cart
function addToCart(course) {
  const existingItem = cart.find(item => item.id === course.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Ensure course has a `discounted_price` key
    cart.push({ ...course, quantity: 1 });
  }
  updateCart();
}

// Function to update the cart display
function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  cartItemsContainer.innerHTML = ""; // Clear existing items
  let totalPrice = 0;

  cart.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
      <h3>${item.title}</h3>
      <p>Price: ₹${item.discounted_price}</p>
      <p>Quantity: <span id="item-${item.id}-quantity">${item.quantity}</span></p>
      <button onclick="adjustQuantity(${item.id}, 1)">+</button>
      <button onclick="adjustQuantity(${item.id}, -1)">-</button>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItemsContainer.appendChild(itemElement);

    totalPrice += parseFloat(item.discounted_price) * item.quantity;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);
}


// Function to adjust item quantity (+/-)
function adjustQuantity(itemId, amount) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + amount); // Prevent quantity from going below 1
    updateCart();
  }
}

// Function to remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCart();
}

// Function to proceed to checkout
function proceedToCheckout() {
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("checkout-page").style.display = "block";
}

// Function to go back to the cart page
function goBackToCart() {
  document.getElementById("cart-page").style.display = "block";
  document.getElementById("checkout-page").style.display = "none";
}

// Function to handle payment method selection
document.getElementById("payment-method").addEventListener("change", function() {
  const method = this.value;
  const paymentDetails = document.getElementById("payment-details");
  paymentDetails.innerHTML = "";

  if (method === "credit-card" || method === "debit-card") {
    paymentDetails.innerHTML = `
      <div class="form-row">
        <label for="card-number">Card Number:</label>
        <input type="text" id="card-number" placeholder="Enter card number" required>
      </div>
      <div class="form-row">
        <label for="expiry-date">Expiry Date:</label>
        <input type="text" id="expiry-date" placeholder="MM/YY" required>
      </div>
      <div class="form-row">
        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" placeholder="CVV" required>
      </div>
    `;
  } else if (method === "upi") {
    paymentDetails.innerHTML = `
      <label for="upi-id">UPI ID:</label>
      <input type="text" id="upi-id" placeholder="Enter UPI ID" required>
    `;
  }
});

// Function to submit payment (with two-step verification)
document.getElementById("payment-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const method = document.getElementById("payment-method").value;
  const paymentData = {};

  if (method === "credit-card" || method === "debit-card") {
    paymentData.cardNumber = document.getElementById("card-number").value;
    paymentData.expiryDate = document.getElementById("expiry-date").value;
    paymentData.cvv = document.getElementById("cvv").value;
  } else if (method === "upi") {
    paymentData.upiId = document.getElementById("upi-id").value;
  }

  // Step 1: Validate payment details and proceed to two-step verification
  performTwoStepVerification(paymentData);
});

// Function for two-step verification (simulating)
function performTwoStepVerification(paymentData) {
  // Simulate sending OTP to the user's mobile or email
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
  const enteredOtp = prompt(`An OTP has been sent to your registered contact. Please enter the OTP: ${otp}`);
  
  if (enteredOtp === otp.toString()) {
    alert("OTP verified! Payment successful.");
    // Proceed with the payment process
    completePayment(paymentData);
  } else {
    alert("Invalid OTP. Please try again.");
  }
}

// Simulate completing the payment
function completePayment(paymentData) {
  // Handle actual payment gateway integration here (e.g., integrating Stripe, Razorpay, etc.)
  console.log("Payment data:", paymentData);
  alert("Payment has been successfully processed!");
  window.location.href = "payment-success.html";
}


// Call updateCart on page load to populate the cart
window.onload = function() {
  if (window.location.pathname.includes("cart")) {
    updateCart();
  }
};




// Call load functions on page load to populate blogs and courses
window.onload = function() {
  loadBlogs();
  loadDiscountedCourses();
};
