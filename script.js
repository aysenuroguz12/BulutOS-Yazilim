```javascript
(function () {

  /* =========================
     MOBİL MENÜ
  ========================= */

  var btn = document.getElementById('burgerBtn');
  var nav = document.getElementById('mainNav');

  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* =========================
     İLETİŞİM FORMU
  ========================= */

  var form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ad = document.getElementById('adsoyad').value;
      var mail = document.getElementById('eposta').value;
      var konu = encodeURIComponent(
        document.getElementById('konu').value
      );
      var mesaj = document.getElementById('mesaj').value;

      var body = encodeURIComponent(
        'Gönderen: ' + ad + ' (' + mail + ')\n\n' + mesaj
      );

      window.location.href =
        'mailto:support@bulutos.com.tr?subject=' +
        konu +
        '&body=' +
        body;
    });
  }


  /* =========================
     SEPET SİSTEMİ
  ========================= */

  var CART_KEY = 'bulutos_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }


  /* =========================
     SEPET SAYISINI GÜNCELLE
  ========================= */

  function updateCartCount() {
    var cart = getCart();

    var totalQuantity = cart.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);

    document.querySelectorAll('[data-cart-count]').forEach(function (element) {
      element.textContent = totalQuantity;
    });
  }


  /* =========================
     ÜRÜNÜ SEPETE EKLE
  ========================= */

  document.querySelectorAll('.add-to-cart').forEach(function (button) {

    button.addEventListener('click', function () {

      var card = button.closest('.card');

      if (!card) {
        return;
      }

      var id = button.dataset.id;
      var name = card.querySelector('h3').textContent.trim();

      var priceElement = card.querySelector('.price');

      var priceText = priceElement
        ? priceElement.textContent
        : '0';

      var price = parseFloat(
        priceText
          .replace('TL', '')
          .replace('/ adet', '')
          .trim()
          .replace('.', '')
          .replace(',', '.')
      );

      var cart = getCart();

      var existingProduct = cart.find(function (item) {
        return item.id === id;
      });

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({
          id: id,
          name: name,
          price: price,
          quantity: 1
        });
      }

      saveCart(cart);
      updateCartCount();

      var originalText = button.textContent;

      button.textContent = 'Sepete Eklendi';
      button.disabled = true;

      setTimeout(function () {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);

    });

  });


  /* =========================
     SEPET SAYFASI
  ========================= */

  var cartRoot = document.getElementById('cartRoot');

  if (cartRoot) {

    function renderCart() {

      var cart = getCart();

      if (cart.length === 0) {

        cartRoot.innerHTML = `
          <div class="card">
            <h3>Sepetiniz boş</h3>
            <p>Henüz sepetinize ürün eklemediniz.</p>
            <a href="urunler.html" class="btn btn-primary">
              Ürünlere Git
            </a>
          </div>
        `;

        updateCartCount();
        return;
      }


      var total = 0;

      var html = `
        <div class="card">
          <h2>Sepetiniz</h2>
          <div class="cart-items">
      `;


      cart.forEach(function (item, index) {

        var itemTotal = item.price * item.quantity;

        total += itemTotal;

        html += `
          <div class="cart-item">
            <div>
              <h3>${item.name}</h3>
              <p>${item.price.toFixed(2)} TL / adet</p>
            </div>

            <div class="cart-controls">
              <button type="button"
                      class="quantity-btn"
                      data-action="decrease"
                      data-index="${index}">
                −
              </button>

              <strong>${item.quantity}</strong>

              <button type="button"
                      class="quantity-btn"
                      data-action="increase"
                      data-index="${index}">
                +
              </button>

              <strong>
                ${itemTotal.toFixed(2)} TL
              </strong>

              <button type="button"
                      class="remove-cart"
                      data-index="${index}">
                Sil
              </button>
            </div>
          </div>
        `;

      });


      html += `
          </div>

          <hr>

          <div class="cart-total">
            <strong>Toplam</strong>
            <strong>${total.toFixed(2)} TL</strong>
          </div>

          <div style="margin-top:20px;">
            <a href="urunler.html" class="btn">
              Alışverişe Devam Et
            </a>

            <a href="odeme.html" class="btn btn-primary">
              Ödemeye Geç
            </a>
          </div>

        </div>
      `;

      cartRoot.innerHTML = html;


      /* MİKTAR ARTIR / AZALT */

      cartRoot.querySelectorAll('.quantity-btn').forEach(function (button) {

        button.addEventListener('click', function () {

          var index = Number(button.dataset.index);
          var action = button.dataset.action;

          if (action === 'increase') {
            cart[index].quantity += 1;
          }

          if (action === 'decrease') {
            cart[index].quantity -= 1;

            if (cart[index].quantity <= 0) {
              cart.splice(index, 1);
            }
          }

          saveCart(cart);
          renderCart();

        });

      });


      /* ÜRÜN SİL */

      cartRoot.querySelectorAll('.remove-cart').forEach(function (button) {

        button.addEventListener('click', function () {

          var index = Number(button.dataset.index);

          cart.splice(index, 1);

          saveCart(cart);
          renderCart();

        });

      });

    }

    renderCart();

  }


  /* =========================
     SAYFA AÇILINCA SEPET SAYISI
  ========================= */

  updateCartCount();

})();
```
