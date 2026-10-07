(function(){
  var btn = document.getElementById('burgerBtn');
  var nav = document.getElementById('mainNav');

  if (btn && nav) {
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.getElementById('contactForm');
  if (form) {
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
})();
