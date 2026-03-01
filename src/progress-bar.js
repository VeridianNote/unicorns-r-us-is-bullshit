if (typeof window !== 'undefined') {
  const bar = document.createElement('div');
  bar.id = 'reading-progress';
  document.body.prepend(bar);

  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();

  // Recalculate progress bar when TOC toggles (changes page height)
  new MutationObserver(update).observe(document.body, {
    attributes: true, subtree: true, attributeFilter: ['open', 'data-collapsed']
  });

  // Close mobile TOC when a link is clicked + smooth scroll
  // Uses capture phase so we see the click before React/Docusaurus.
  // Close first, then scroll after collapse finishes (so height is stable).
  document.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-toc summary')) return;
    const link = e.target.closest('.mobile-toc a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    const details = link.closest('details');
    if (details && details.open) {
      const summary = details.querySelector('summary');
      if (summary) {
        summary.click(); // triggers Docusaurus's animated collapse
        // Wait for collapse animation to finish, then scroll
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          update();
        }, 400);
      }
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, true);
}
