    // --- Lista global de vídeos ---
    var allVideos = [];
    document.querySelectorAll('.gallery-item--video').forEach(function(item) {
      var thumb = item.querySelector('.gallery-video-thumb');
      var caption = item.querySelector('.caption');
      if (thumb) allVideos.push({ src: thumb.src, label: caption ? caption.textContent : '' });
    });

    // --- Carrusel de fotos ---
    document.querySelectorAll('.gallery-carousel').forEach(function(carousel) {
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots   = carousel.querySelectorAll('.carousel-dot');
      let current  = 0;
      function goTo(n) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
      }
      carousel.querySelector('.carousel-next').addEventListener('click', function(e) { e.stopPropagation(); goTo(current + 1); });
      carousel.querySelector('.carousel-prev').addEventListener('click', function(e) { e.stopPropagation(); goTo(current - 1); });
      dots.forEach(function(dot, i) { dot.addEventListener('click', function(e) { e.stopPropagation(); goTo(i); }); });
      carousel.addEventListener('click', function() {
        var images = Array.prototype.map.call(slides, function(slide) { return { src: slide.src, alt: slide.alt }; });
        openLightbox(images, current);
      });
    });

    // --- Autoplay en hover de miniaturas de vídeo ---
    document.querySelectorAll('.gallery-video-wrap').forEach(function(wrap) {
      var vid = wrap.querySelector('.gallery-video-thumb');
      wrap.addEventListener('mouseenter', function() { vid.play(); });
      wrap.addEventListener('mouseleave', function() { vid.pause(); vid.currentTime = 0; });
    });

    // --- Lightbox FOTOS ---
    var lightbox      = document.getElementById('lightbox');
    var lightboxImg   = document.getElementById('lightbox-img');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev  = document.getElementById('lightbox-prev');
    var lightboxNext  = document.getElementById('lightbox-next');
    var lightboxCounter = document.getElementById('lightbox-counter');
    var currentImages = []; // solo las imágenes del proyecto abierto
    var lbIndex = 0;

    function openLightbox(images, startIndex) {
      currentImages = images;
      lbIndex = startIndex || 0;
      showLightboxImage();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function showLightboxImage() {
      var im = currentImages[lbIndex];
      lightboxImg.src = im.src;
      lightboxImg.alt = im.alt || '';
      lightboxCounter.textContent = (lbIndex + 1) + ' / ' + currentImages.length;
      lightboxPrev.style.display = currentImages.length > 1 ? '' : 'none';
      lightboxNext.style.display = currentImages.length > 1 ? '' : 'none';
    }
    function lbGo(dir) {
      lbIndex = (lbIndex + dir + currentImages.length) % currentImages.length;
      showLightboxImage();
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item:not(.gallery-item--video) > img').forEach(function(img) {
      img.addEventListener('click', function() { openLightbox([{ src: img.src, alt: img.alt }], 0); });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function(e) { e.stopPropagation(); lbGo(-1); });
    lightboxNext.addEventListener('click', function(e) { e.stopPropagation(); lbGo(1); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });

    // --- Lightbox VÍDEOS ---
    var lbVideo    = document.getElementById('lightbox-video');
    var lbvPlayer  = document.getElementById('lbv-player');
    var lbvClose   = document.getElementById('lbv-close');
    var lbvPrev    = document.getElementById('lbv-prev');
    var lbvNext    = document.getElementById('lbv-next');
    var lbvCounter = document.getElementById('lbv-counter');
    var lbvIndex   = 0;

    function openVideoLightbox(idx) {
      lbvIndex = idx;
      showLbVideo();
      lbVideo.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function showLbVideo() {
      lbvPlayer.src = allVideos[lbvIndex].src;
      lbvPlayer.load();
      lbvPlayer.play();
      lbvCounter.textContent = allVideos.length > 1 ? (lbvIndex + 1) + ' / ' + allVideos.length : '';
      lbvPrev.style.display = allVideos.length > 1 ? '' : 'none';
      lbvNext.style.display = allVideos.length > 1 ? '' : 'none';
    }
    function closeVideoLightbox() {
      lbvPlayer.pause();
      lbvPlayer.src = '';
      lbVideo.classList.remove('open');
      document.body.style.overflow = '';
    }
    function lbvGo(dir) {
      lbvIndex = (lbvIndex + dir + allVideos.length) % allVideos.length;
      showLbVideo();
    }

    document.querySelectorAll('.gallery-item--video .gallery-video-wrap').forEach(function(wrap, i) {
      wrap.addEventListener('click', function() { openVideoLightbox(i); });
    });
    lbvClose.addEventListener('click', closeVideoLightbox);
    lbvPrev.addEventListener('click', function(e) { e.stopPropagation(); lbvGo(-1); });
    lbvNext.addEventListener('click', function(e) { e.stopPropagation(); lbvGo(1); });
    lbVideo.addEventListener('click', function(e) { if (e.target === lbVideo) closeVideoLightbox(); });

    // Teclado — ambos lightboxes
    document.addEventListener('keydown', function(e) {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lbGo(-1);
        if (e.key === 'ArrowRight') lbGo(1);
      }
      if (lbVideo.classList.contains('open')) {
        if (e.key === 'Escape') closeVideoLightbox();
        if (e.key === 'ArrowLeft') lbvGo(-1);
        if (e.key === 'ArrowRight') lbvGo(1);
      }
    });
