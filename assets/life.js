(() => {
  const photos = Array.isArray(window.LINGYI_LIFE) ? window.LINGYI_LIFE : [];
  const gallery = document.getElementById('gallery');
  const empty = document.getElementById('gallery-empty');
  const dialog = document.getElementById('photo-dialog');
  let current = 0;
  let lastFocused = null;
  function safe(text) {
    return String(text ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  if (photos.length) {
    empty.hidden = true;
    gallery.innerHTML = photos.map((photo, index) =>
      `<button type="button" class="gallery-item" data-photo="${index}" aria-label="Open photograph: ${safe(photo.title)}"><img src="${safe(photo.src)}" alt="${safe(photo.alt || photo.title)}" width="${Number(photo.width) || 1200}" height="${Number(photo.height) || 900}" loading="lazy"><span>${safe(photo.title)}</span></button>`
    ).join('');
    gallery.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
      lastFocused = button;
      show(Number(button.dataset.photo));
      dialog.showModal();
      document.getElementById('photo-close').focus();
    }));
  }
  function show(index) {
    if (!photos[index]) return;
    current = index;
    const photo = photos[index];
    const image = document.getElementById('photo-full');
    image.src = photo.src;
    image.alt = photo.alt || photo.title;
    document.getElementById('photo-title').textContent = photo.title;
    document.getElementById('photo-description').textContent = photo.description || '';
    document.getElementById('photo-count').textContent = `${index + 1} / ${photos.length}`;
    document.getElementById('photo-prev').disabled = photos.length < 2;
    document.getElementById('photo-next').disabled = photos.length < 2;
  }
  function close() {
    dialog.close();
    if (lastFocused) lastFocused.focus();
  }
  document.getElementById('photo-close').addEventListener('click', close);
  document.getElementById('photo-prev').addEventListener('click', () => show((current - 1 + photos.length) % photos.length));
  document.getElementById('photo-next').addEventListener('click', () => show((current + 1) % photos.length));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show((current - 1 + photos.length) % photos.length);
    if (event.key === 'ArrowRight') show((current + 1) % photos.length);
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) close();
  });
})();
