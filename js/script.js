// GC Dance Academy - Küçük Etkileşimler

// Scroll ilerleme çubuğu
const progressBar = document.getElementById('scroll-progress');

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${progress}%`;
};

window.addEventListener('scroll', updateProgress);
updateProgress();

// Scroll ile animasyon - tüm .section öğelerine görünürlük geçişi uygular
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // yalnızca ilk görünümde uygula
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.section').forEach(element => {
  observer.observe(element);
});

// Program kartları için scroll animasyonu
const programCards = document.querySelectorAll('.program-cards .card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

programCards.forEach(card => cardObserver.observe(card));

// Eğitmen slider'ı
const instructorCarousel = document.querySelector('.instructor-carousel');
const instructorTrack = document.querySelector('.instructor-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

if (instructorTrack && instructorCarousel) {
  // Sonsuz döngü için ilk ve son slaytları klonla
  let slides = Array.from(instructorTrack.children);
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.add('clone');
  lastClone.classList.add('clone');
  instructorTrack.appendChild(firstClone);
  instructorTrack.insertBefore(lastClone, slides[0]);
  slides = Array.from(instructorTrack.children);

  let index = 1; // İlk gerçek slayt

  const setActive = () => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
  };

  const moveToIndex = (i, animate = true) => {
    const cardWidth = slides[i].offsetWidth;
    const gap = parseFloat(getComputedStyle(instructorTrack).gap) || 0;
    const containerWidth = instructorCarousel.clientWidth;
    const offset = (cardWidth + gap) * i - (containerWidth - cardWidth) / 2;
    instructorTrack.style.transition = animate ? 'transform 0.5s ease' : 'none';
    instructorTrack.style.transform = `translateX(-${offset}px)`;
    setActive();
  };

  moveToIndex(index, false);

  nextBtn?.addEventListener('click', () => {
    index++;
    moveToIndex(index);
  });

  prevBtn?.addEventListener('click', () => {
    index--;
    moveToIndex(index);
  });

  instructorTrack.addEventListener('transitionend', () => {
    if (slides[index].classList.contains('clone')) {
      index = slides[index] === firstClone ? 1 : slides.length - 2;
      moveToIndex(index, false);
    }
  });

  window.addEventListener('resize', () => moveToIndex(index, false));

  // Swipe desteği
  let startX = 0;
  instructorCarousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  instructorCarousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? nextBtn?.click() : prevBtn?.click();
    }
  });

  // Flip efekti
  instructorTrack.addEventListener('click', (e) => {
    const card = e.target.closest('.instructor-card');
    if (card) card.classList.toggle('flipped');
  });
}

// Klavye yön tuşları
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevBtn?.click();
  if (e.key === 'ArrowRight') nextBtn?.click();
});

// Hamburger menü
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  const isOpen = hamburger.classList.contains('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  navLinks.classList.toggle('active', isOpen);
  navActions?.classList.toggle('active', isOpen);
});

// Menüden bağlantı seçildiğinde menüyü kapat
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    navActions?.classList.remove('active');
  });
});

// Galeri görselleri için modal
const galleryImages = document.querySelectorAll('.gallery-feature img, .mosaic-item img');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = imageModal.querySelector('.close');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    modalImg.src = img.src;
    imageModal.classList.add('show');
  });
});

imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal || e.target === modalClose) {
    imageModal.classList.remove('show');
    modalImg.src = '';
  }
});
