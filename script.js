document.addEventListener('DOMContentLoaded', () => {
  // ---------- HIGHLIGHT ACTIVE NAVIGATION BASED ON CURRENT PAGE ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active-nav');
    } else {
      link.classList.remove('active-nav');
    }
  });

  // ---------- MOBILE HAMBURGER MENU ----------
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });

  // ---------- SERVICES TABS (only on services.html) ----------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const subpages = document.querySelectorAll('.service-subpage');
  if (tabBtns.length && subpages.length) {
    function activateServiceTab(serviceId) {
      subpages.forEach(page => {
        page.classList.remove('active-subpage');
        if (page.id === serviceId) page.classList.add('active-subpage');
      });
      tabBtns.forEach(btn => {
        btn.classList.remove('active-tab');
        if (btn.getAttribute('data-service') === serviceId) btn.classList.add('active-tab');
      });
    }
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const service = btn.getAttribute('data-service');
        if (service) activateServiceTab(service);
      });
    });
    if (subpages.length) activateServiceTab('emergencies');
  }

  // ---------- DONATION FORM WITH BD CURRENCY & HEART POPUP ----------
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    const amountOptions = document.querySelectorAll('.amount-options span');
    const customAmountInput = document.getElementById('customAmount');
    const selectedAmountHidden = document.getElementById('selectedAmount');
    let defaultOpt = null;

    if (amountOptions.length) {
      amountOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          amountOptions.forEach(el => el.classList.remove('active-amount'));
          opt.classList.add('active-amount');
          const amountValue = opt.getAttribute('data-amount');
          if (amountValue === 'custom') {
            if (customAmountInput) customAmountInput.style.display = 'block';
            if (selectedAmountHidden) selectedAmountHidden.value = '';
          } else {
            if (customAmountInput) customAmountInput.style.display = 'none';
            if (selectedAmountHidden) selectedAmountHidden.value = amountValue;
          }
        });
      });
      defaultOpt = Array.from(amountOptions).find(opt => opt.getAttribute('data-amount') === '25');
      if (defaultOpt) defaultOpt.click();
    }

    if (customAmountInput) {
      customAmountInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val && !isNaN(val) && val > 0) {
          if (selectedAmountHidden) selectedAmountHidden.value = val;
        } else {
          if (selectedAmountHidden) selectedAmountHidden.value = '';
        }
      });
      customAmountInput.addEventListener('focus', () => {
        amountOptions.forEach(opt => opt.classList.remove('active-amount'));
        const customOpt = Array.from(amountOptions).find(opt => opt.getAttribute('data-amount') === 'custom');
        if (customOpt) customOpt.classList.add('active-amount');
      });
    }

    // Function to show the custom popup modal with BD currency
    function showThankYouPopup(donorName, amount) {
      let modalOverlay = document.querySelector('.modal-overlay');
      if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
          <div class="donation-modal">
            <div class="heart-animation">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Thank You! ❤️</h3>
            <p id="popupMessage">Your generosity saves lives.</p>
            <button class="modal-close-btn">Close</button>
          </div>
        `;
        document.body.appendChild(modalOverlay);
      }
      
      // Format amount with BD (Bahraini Dinar)
      const formattedAmount = `${amount} BD`;
      
      const msgPara = modalOverlay.querySelector('#popupMessage');
      msgPara.innerHTML = `Thank you <strong>${donorName}</strong>!<br>Your donation of <strong>${formattedAmount}</strong> brings quality healthcare to those in need.`;
      
      modalOverlay.classList.add('active');
      
      const closeBtn = modalOverlay.querySelector('.modal-close-btn');
      const closeModal = () => {
        modalOverlay.classList.remove('active');
        closeBtn.removeEventListener('click', closeModal);
        modalOverlay.removeEventListener('click', outsideClick);
      };
      closeBtn.addEventListener('click', closeModal);
      
      const outsideClick = (e) => {
        if (e.target === modalOverlay) closeModal();
      };
      modalOverlay.addEventListener('click', outsideClick);
    }

    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const donorName = document.getElementById('donorName')?.value.trim();
      const donorEmail = document.getElementById('donorEmail')?.value.trim();
      let amount = selectedAmountHidden?.value;
      if (!amount && customAmountInput?.style.display === 'block') {
        amount = customAmountInput.value;
      }
      if (!donorName || !donorEmail) {
        alert('❌ Please enter your name and email address.');
        return;
      }
      if (!amount || amount <= 0) {
        alert('❌ Please select or enter a valid donation amount in BD.');
        return;
      }
      
      // Show the animated popup instead of alert
      showThankYouPopup(donorName, amount);
      
      // Reset the form
      donationForm.reset();
      if (defaultOpt) defaultOpt.click();
      if (customAmountInput) customAmountInput.value = '';
      if (selectedAmountHidden) selectedAmountHidden.value = '25';
    });
  }

  // ---------- CONTACT FORM ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMsg')?.value.trim();
      if (!name || !email || !message) {
        alert('⚠️ Please fill in all fields (name, email, message).');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        alert('📧 Please enter a valid email address.');
        return;
      }
      alert(`📬 Message sent!\n\nHi ${name}, we’ve received your inquiry and will reply within 24 hours at ${email}.\n\nYour message: "${message.substring(0, 80)}${message.length > 80 ? '…' : ''}"`);
      contactForm.reset();
    });
  }

  // ---------- SHOP PAGE: ADD TO CART & CHECKOUT (with BD currency) ----------
  const cartItems = [];
  const cartList = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  function updateCartDisplay() {
    if (!cartList) return;
    cartList.innerHTML = '';
    let total = 0;
    cartItems.forEach((item, index) => {
      total += item.price;
      const li = document.createElement('li');
      li.innerHTML = `${item.name} - ${item.price.toFixed(2)} BD <button class="remove-item" data-index="${index}" style="background:none; border:none; color:#e74c3c; cursor:pointer;"><i class="fas fa-trash-alt"></i></button>`;
      cartList.appendChild(li);
    });
    if (cartTotalSpan) cartTotalSpan.innerText = total.toFixed(2);
    
    // Add remove functionality
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cartItems.splice(idx, 1);
        updateCartDisplay();
      });
    });
  }

  // Add to cart buttons
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      cartItems.push({ name, price });
      updateCartDisplay();
      
      // Show small feedback (optional)
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 1000);
    });
  });

  // Checkout function with heart popup (BD currency)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty. Add some merchandise first!');
        return;
      }
      const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
      
      // Reuse or create thank you popup (similar to donation popup)
      let modalOverlay = document.querySelector('.modal-overlay');
      if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
          <div class="donation-modal">
            <div class="heart-animation">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Thank You for Shopping!</h3>
            <p id="popupMessage">Your purchase supports global health.</p>
            <button class="modal-close-btn">Close</button>
          </div>
        `;
        document.body.appendChild(modalOverlay);
      }
      
      const msgPara = modalOverlay.querySelector('#popupMessage');
      msgPara.innerHTML = `You’ve contributed <strong>${total} BD</strong> to SDG 3!<br>Every item brings healthcare closer to those in need. ❤️`;
      
      modalOverlay.classList.add('active');
      
      const closeBtn = modalOverlay.querySelector('.modal-close-btn');
      const closeModal = () => {
        modalOverlay.classList.remove('active');
        closeBtn.removeEventListener('click', closeModal);
        modalOverlay.removeEventListener('click', outsideClick);
      };
      const outsideClick = (e) => {
        if (e.target === modalOverlay) closeModal();
      };
      closeBtn.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', outsideClick);
      
      // Clear cart after checkout
      cartItems.length = 0;
      updateCartDisplay();
    });
  }
});