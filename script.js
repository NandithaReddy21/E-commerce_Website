document.addEventListener("DOMContentLoaded", function () {
    // ---------- General ----------
    const year = document.querySelector("#year");
    const thisYear = new Date().getFullYear();
    if (year) {
        year.setAttribute("datetime", thisYear);
        year.textContent = thisYear;
    }

    const bar = document.querySelector(".mobile");
    const nav = document.querySelector(".header__nav");
    const close = document.querySelector("#close");

    if (bar) {
        bar.addEventListener('click', () => nav.classList.add('active'));
    }

    if (close) {
        close.addEventListener('click', () => nav.classList.remove('active'));
    }

    // ---------- Shop Page ----------
    const productCards = document.querySelectorAll(".main__pro");

    productCards.forEach((card) => {
        card.querySelector("a").addEventListener("click", function () {
            const product = {
                id: card.getAttribute("data-id"),
                image: card.getAttribute("data-img"),
                title: card.getAttribute("data-title"),
                price: card.getAttribute("data-price"),
                desc: card.getAttribute("data-desc")
            };
            localStorage.setItem("selectProduct", JSON.stringify(product));
            window.location.href = "sproduct.html";
        });
    });

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();

            const card = btn.closest(".main__pro");
            const id = card.getAttribute("data-id");
            const title = card.getAttribute("data-title");
            const price = card.getAttribute("data-price");
            const image = card.getAttribute("data-img");

            const item = { id, title, price, image, quantity: 1 };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let existing = cart.find(i => i.id === id);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(item);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Item added to cart!");
        });
    });

    // ---------- Single Product Page ----------
    if (window.location.pathname.includes("sproduct.html")) {
        const storedProduct = localStorage.getItem("selectProduct");

        if (!storedProduct) {
            window.location.href = "shop.html";
            return;
        }

        const product = JSON.parse(storedProduct);

        const productImg = document.getElementById("product-img");
        const productTitle = document.getElementById("product-title");
        const productPrice = document.getElementById("product-price");
        const productDesc = document.getElementById("product-desc");

        if (productImg && productTitle && productPrice && productDesc) {
            productImg.src = product.image;
            productImg.alt = product.title;
            productTitle.textContent = product.title;
            productPrice.innerHTML = `<span><i class="fa-solid fa-indian-rupee-sign"></i></span> ${product.price}`;
            productDesc.textContent = product.desc || "No details available.";
        }

        const addBtn = document.getElementById("add-to-cart-product");
        const qtyInput = document.getElementById("quantity");

        if (addBtn && qtyInput) {
            addBtn.addEventListener("click", () => {
                const quantity = parseInt(qtyInput.value);
                const item = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                };

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                let existing = cart.find(i => i.id === item.id);

                if (existing) {
                    existing.quantity += quantity;
                } else {
                    cart.push(item);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                alert("Added to Cart!");
            });
        }
    }

    // ---------- Contact Page ----------

    const form = document.querySelector(".message-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thanks for contacting us!");
            form.reset();
        });
    }

    // ---------- General ----------

    const signUpForm = document.querySelector("#signup-form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            let msg = document.getElementById("signup-message");

            if (password !== confirmPassword) {
                msg.style.color = "red";
                msg.textContent = "Passwords do not match";
                return;
            }

            // Check if user already exists
            if (localStorage.getItem(email)) {
                msg.style.color = "red";
                msg.textContent = "User already exists. Please log in instead.";
                return;
            }

            localStorage.setItem(email, JSON.stringify({ password }));
            msg.style.color = "green";
            msg.textContent = "Sign up successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        });
    }


    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;
            let msg = document.getElementById("login-message");

            const storedUser = JSON.parse(localStorage.getItem(email));

            if(!storedUser || storedUser.password !== password) {
                msg.style.color = "red";
                msg.textContent = "Invalid email or password.";
                return;
            }

            msg.style.color = "green";
            msg.textContent = "Login successful! Redirecting..."
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUser", email);

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }


    // ---------- Cart Page ----------
    const cartTable = document.getElementById("cart-body");

    if (cartTable) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function updateCartHTML() {
            cartTable.innerHTML = "";

            cart.forEach((item, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><i class="fa-solid fa-circle-xmark remove-item" data-index="${index}"></i></td>
                    <td><img src="${item.image}" alt="${item.title}" width="60"></td>
                    <td>${item.title}</td>
                    <td><h4><span><i class="fa-solid fa-indian-rupee-sign"></i></span> ${item.price}</h4></td>
                    <td><input type="number" min="1" value="${item.quantity}" class="cart-qty" data-index="${index}"></td>
                `;
                cartTable.appendChild(row);
            });

            updateTotal();
        }

        function updateTotal() {
            let total = 0;
            cart.forEach(item => total += item.quantity * parseFloat(item.price));

            const subTotalCell = document.querySelector(".sub-total table tr:nth-child(1) td:nth-child(2)");
            const totalCell = document.querySelector(".sub-total table tr:nth-child(3) td:nth-child(2)");

            if (subTotalCell && totalCell) {
                subTotalCell.innerHTML = `<span><i class="fa-solid fa-indian-rupee-sign"></i></span> ${total}`;
                totalCell.innerHTML = `<strong><span><i class="fa-solid fa-indian-rupee-sign"></i></span> ${total}</strong>`;
            }
        }

        cartTable.addEventListener("click", function (e) {
            if (e.target.classList.contains("remove-item")) {
                const index = e.target.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartHTML();
            }
        });

        cartTable.addEventListener("input", function (e) {
            if (e.target.classList.contains("cart-qty")) {
                const index = e.target.getAttribute("data-index");
                const newQty = parseInt(e.target.value);
                if (newQty >= 1) {
                    cart[index].quantity = newQty;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateTotal();
                }
            }
        });

        updateCartHTML();
    }


    // ---------- Theme ----------

    const toggleBtn = document.querySelector("#mode-toggle");

    // apply saved preference when page loads
    const currentMode = localStorage.getItem("darkMode");
    if (currentMode === "enabled") {
        document.body.classList.add("dark-mode");
        toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    } else {
        toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`
    }

    // toggle dark mode and update localStorage
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

        if (isDarkMode) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        } else {
            toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        }
    });
});
