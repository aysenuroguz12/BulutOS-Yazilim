(function(){
  /* ---------- Mobil menü ---------- */
  var btn = document.getElementById('burgerBtn');
  var nav = document.getElementById('mainNav');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      });
    });
  }

  /* ---------- İletişim formu (mailto) ---------- */
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ad = document.getElementById('adsoyad').value;
      var mail = document.getElementById('eposta').value;
      var konu = encodeURIComponent(document.getElementById('konu').value);
      var mesaj = document.getElementById('mesaj').value;
      var body = encodeURIComponent('Gönderen: ' + ad + ' (' + mail + ')\n\n' + mesaj);
      window.location.href = 'mailto:support@bulutos.com.tr?subject=' + konu + '&body=' + body;
    });
  }

  /* ---------- Sepet / Ödeme / Sipariş (simülasyon) ---------- */
  var CART_KEY = 'bulutos_cart';
  var ORDER_KEY = 'bulutos_last_order';
  var PRODUCTS = {
    lisans:   { name: 'BulutOS Yazılım Lisansı', price: 250 },
    smartbox: { name: 'BulutOS SmartBox',        price: 590 }
  };
  var PAY_LABELS = {
    kart:   'Kredi / Banka Kartı (simülasyon)',
    havale: 'Havale / EFT',
    vadeli: 'Vadeli ödeme (1 tur)'
  };

  function read(key){ try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; } }
  function write(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
  function remove(key){ try { localStorage.removeItem(key); } catch(e){} }
  function tl(n){ return n.toLocaleString('tr-TR') + ' TL'; }
  function el(tag, cls, text){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function getCart(){
    var c = read(CART_KEY);
    return (c && typeof c === 'object') ? c : {};
  }
  function lines(cart){
    return Object.keys(cart)
      .filter(function(id){ return PRODUCTS[id] && cart[id] > 0; })
      .map(function(id){
        var qty = Math.min(parseInt(cart[id], 10) || 0, 999);
        return { id: id, name: PRODUCTS[id].name, price: PRODUCTS[id].price, qty: qty, total: qty * PRODUCTS[id].price };
      });
  }
  function totalOf(ls){ return ls.reduce(function(s, l){ return s + l.total; }, 0); }

  function updateBadge(){
    var count = lines(getCart()).reduce(function(s, l){ return s + l.qty; }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function(b){ b.textContent = count; });
  }

  /* Ürünler: Sepete Ekle */
  document.querySelectorAll('.add-to-cart').forEach(function(b){
    b.addEventListener('click', function(){
      var id = b.getAttribute('data-id');
      if(!PRODUCTS[id]) return;
      var cart = getCart();
      cart[id] = (cart[id] || 0) + 1;
      write(CART_KEY, cart);
      updateBadge();
      var old = b.textContent;
      b.textContent = 'Sepete eklendi ✓';
      setTimeout(function(){ b.textContent = old; }, 1400);
    });
  });

  /* Sepet sayfası */
  var cartRoot = document.getElementById('cartRoot');
  function renderCart(){
    if(!cartRoot) return;
    cartRoot.textContent = '';
    var ls = lines(getCart());
    if(!ls.length){
      var empty = el('div', 'panel empty');
      empty.appendChild(el('p', null, 'Sepetiniz boş.'));
      var a = el('a', 'btn btn-primary', 'Ürünlere Git');
      a.href = 'urunler.html';
      empty.appendChild(a);
      cartRoot.appendChild(empty);
      return;
    }
    var panel = el('div', 'panel');
    ls.forEach(function(l){
      var row = el('div', 'cart-row');
      var info = el('div', 'cart-name');
      info.appendChild(el('strong', null, l.name));
      info.appendChild(el('span', null, tl(l.price) + ' / adet'));
      row.appendChild(info);

      var qty = el('div', 'qty');
      var dec = el('button', null, '−'); dec.type = 'button';
      dec.setAttribute('data-act', 'dec'); dec.setAttribute('data-id', l.id);
      dec.setAttribute('aria-label', l.name + ' adedini azalt');
      var num = el('span', null, String(l.qty));
      var inc = el('button', null, '+'); inc.type = 'button';
      inc.setAttribute('data-act', 'inc'); inc.setAttribute('data-id', l.id);
      inc.setAttribute('aria-label', l.name + ' adedini artır');
      qty.appendChild(dec); qty.appendChild(num); qty.appendChild(inc);
      row.appendChild(qty);

      row.appendChild(el('div', 'line-total', tl(l.total)));

      var rm = el('button', 'remove', 'Kaldır'); rm.type = 'button';
      rm.setAttribute('data-act', 'rm'); rm.setAttribute('data-id', l.id);
      row.appendChild(rm);
      panel.appendChild(row);
    });
    var sum = el('div', 'sum-row sum-total');
    sum.appendChild(el('span', null, 'Toplam'));
    sum.appendChild(el('span', null, tl(totalOf(ls))));
    panel.appendChild(sum);

    var actions = el('div', 'btn-row');
    var back = el('a', 'btn btn-ghost', 'Alışverişe Devam Et'); back.href = 'urunler.html';
    var go = el('a', 'btn btn-primary', 'Ödemeye Geç'); go.href = 'odeme.html';
    actions.appendChild(back); actions.appendChild(go);
    panel.appendChild(actions);
    cartRoot.appendChild(panel);
  }
  if(cartRoot){
    cartRoot.addEventListener('click', function(e){
      var b = e.target.closest('[data-act]');
      if(!b) return;
      var id = b.getAttribute('data-id');
      var act = b.getAttribute('data-act');
      var cart = getCart();
      if(act === 'inc') cart[id] = Math.min((cart[id] || 0) + 1, 999);
      if(act === 'dec') cart[id] = (cart[id] || 0) - 1;
      if(act === 'rm' || cart[id] <= 0) delete cart[id];
      write(CART_KEY, cart);
      renderCart();
      updateBadge();
    });
    renderCart();
  }

  /* Ödeme sayfası */
  var checkoutForm = document.getElementById('checkoutForm');
  if(checkoutForm){
    var ls = lines(getCart());
    var wrap = document.getElementById('checkoutWrap');
    var emptyNotice = document.getElementById('emptyNotice');
    if(!ls.length){
      wrap.hidden = true;
      emptyNotice.hidden = false;
    } else {
      var list = document.getElementById('summaryList');
      ls.forEach(function(l){
        var row = el('div', 'sum-row');
        row.appendChild(el('span', null, l.name + ' × ' + l.qty));
        row.appendChild(el('span', null, tl(l.total)));
        list.appendChild(row);
      });
      document.getElementById('summaryTotal').textContent = tl(totalOf(ls));

      checkoutForm.addEventListener('submit', function(e){
        e.preventDefault();
        var current = lines(getCart());
        if(!current.length) return;
        var method = checkoutForm.elements['odeme'].value;
        var order = {
          no: 'BO-' + String(Date.now()).slice(-6) + Math.floor(10 + Math.random() * 90),
          date: new Date().toLocaleString('tr-TR'),
          name: document.getElementById('odAd').value.trim(),
          method: PAY_LABELS[method] || method,
          items: current.map(function(l){ return { name: l.name, qty: l.qty, total: l.total }; }),
          total: totalOf(current)
        };
        write(ORDER_KEY, order);
        remove(CART_KEY);
        window.location.href = 'siparis.html';
      });
    }
  }

  /* Sipariş sayfası */
  var orderBox = document.getElementById('orderBox');
  if(orderBox){
    var order = read(ORDER_KEY);
    var noOrder = document.getElementById('noOrder');
    if(!order || !order.items){
      orderBox.hidden = true;
      noOrder.hidden = false;
    } else {
      document.getElementById('orderNo').textContent = order.no;
      document.getElementById('orderDate').textContent = order.date;
      document.getElementById('orderName').textContent = order.name;
      document.getElementById('orderMethod').textContent = order.method;
      var oList = document.getElementById('orderItems');
      order.items.forEach(function(it){
        var row = el('div', 'sum-row');
        row.appendChild(el('span', null, it.name + ' × ' + it.qty));
        row.appendChild(el('span', null, tl(it.total)));
        oList.appendChild(row);
      });
      document.getElementById('orderTotal').textContent = tl(order.total);
    }
  }

  updateBadge();
})();
