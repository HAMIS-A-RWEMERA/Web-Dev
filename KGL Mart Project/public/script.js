let cart = [];

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    } else {
        console.error("Error: Could not find an element with id='cart-sidebar'");
    }
}

function updateUI() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    if (!list || !totalEl || !countEl) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div class="cart-item" onclick="removeItem(${index})" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; cursor:pointer;">
                <span>${item.name}</span>
                <span>${item.price.toLocaleString()} RWF ❌</span>
            </div>
        `;
    });

    totalEl.innerText = total.toLocaleString();
    countEl.innerText = cart.length;
}

function addToCart(name, priceString, button) {
    const numericPrice = parseInt(priceString.replace(/[^0-9]/g, ''));
    
    if (isNaN(numericPrice)) {
        console.error("Could not read the price for:", name);
        return;
    }

    cart.push({ name, price: numericPrice });
    
    // Visual feedback
    const originalText = button.innerText;
    button.innerText = "✅ Added";
    button.style.background = "#ff9800";
    setTimeout(() => {
        button.innerText = originalText;
        button.style.background = "#2e7d32";
    }, 800);

    updateUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateUI();
}

async function checkoutToWhatsApp() {
    if (cart.length === 0) return alert("Your cart is empty!");

    // 1. Get the total amount (removing the 'RWF' and commas to make it a number)
    const totalStr = document.getElementById('cart-total').innerText;
    const totalNum = parseInt(totalStr.replace(/[^0-9]/g, ''));

    // 2. SAVE TO DATABASE (The new part)
    try {
        const response = await fetch('/api/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cartItems: cart, 
                totalAmount: totalNum 
            })
        });
        const dbResult = await response.json();
        console.log("Order saved to SQL with ID:", dbResult.orderId);
    } catch (error) {
        console.error("Database save failed, but proceeding to WhatsApp...", error);
    }

    // 3. SEND TO WHATSAPP (Your existing logic)
    let message = "Hello KGL Mart! I'd like to order:%0A%0A";
    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} - ${item.price.toLocaleString()} RWF%0A`;
    });
    
    message += `%0A*Total: ${totalStr} RWF*`;

    // Note: Replaced the fixed link format here for you
    const whatsappUrl = `https://wa.me/250781549993?text=${message}`;

    window.open(whatsappUrl, '_blank');
}


document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons inside product cards
    const allButtons = document.querySelectorAll('.product-card button');
    
    allButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const nameEl = card.querySelector('h4');
            const priceEl = card.querySelector('p');

            if (nameEl && priceEl) {
                addToCart(nameEl.innerText, priceEl.innerText, button);
            } else {
                console.error("Could not find h4 or p inside this product-card");
            }
        });
    });

    const heroShopBtn = document.querySelector('.hero-buttons button:first-child');
    if (heroShopBtn) {
        heroShopBtn.addEventListener('click', () => {
            const productSection = document.getElementById('products');
            if(productSection) productSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

