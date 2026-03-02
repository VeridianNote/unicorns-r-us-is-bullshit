// =============================================
// Reading progress bar — runs once on module load
// =============================================
if (typeof window !== 'undefined') {
  const bar = document.createElement('div');
  bar.id = 'reading-progress';
  document.body.prepend(bar);

  const updateProgressBar = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  };

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar, { passive: true });
  updateProgressBar();

  // Recalculate when collapsible elements toggle (changes page height)
  new MutationObserver(updateProgressBar).observe(document.body, {
    attributes: true, subtree: true, attributeFilter: ['open', 'data-collapsed']
  });

  // Animated close for mobile TOC <details> elements.
  // Intercepts the summary click when closing, plays CSS slide-up
  // animation, then removes the open attribute.
  function animatedClose(details) {
    details.classList.add('closing');
    details.addEventListener('animationend', function handler() {
      details.removeEventListener('animationend', handler);
      details.classList.remove('closing');
      details.removeAttribute('open');
    }, { once: true });
  }

  // Intercept summary clicks on mobile TOC for animated close
  document.addEventListener('click', (e) => {
    const summary = e.target.closest('.mobile-toc summary');
    if (summary) {
      const details = summary.closest('details');
      if (details && details.open) {
        e.preventDefault();
        animatedClose(details);
      }
      return;
    }

    // Handle share link clicks (in any TOC — mobile or desktop)
    const shareLink = e.target.closest('.toc-share-link');
    if (shareLink) {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        const original = shareLink.innerHTML;
        shareLink.innerHTML = '\u2714 Link copied!';
        shareLink.classList.add('toc-share-link--done');
        showToast('Link copied to clipboard');
        // Fire confetti from bottom of viewport
        spawnConfettiFromBottom();
        // Close mobile TOC if open
        const details = shareLink.closest('details');
        if (details && details.open) {
          animatedClose(details);
        }
        setTimeout(() => {
          shareLink.innerHTML = original;
          shareLink.classList.remove('toc-share-link--done');
        }, 2500);
      });
      return;
    }

    // Close mobile TOC when a link is clicked + smooth scroll
    const link = e.target.closest('.mobile-toc a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    const details = link.closest('details');
    if (details && details.open) {
      animatedClose(details);
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateProgressBar();
      }, 250);
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, true);
}

// =============================================
// Share button — injected before closing section
// =============================================
function showToast(message) {
  // Remove any existing toast
  document.querySelectorAll('.share-toast').forEach(el => el.remove());

  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger entrance animation on next frame
  requestAnimationFrame(() => toast.classList.add('share-toast--visible'));

  setTimeout(() => {
    toast.classList.remove('share-toast--visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 2200);
}

const confettiEmoji = ['\uD83E\uDD84', '\uD83D\uDC09', '\u2764\uFE0F', '\uD83E\uDD84', '\uD83E\uDD18', '\uD83D\uDC09', '\uD83C\uDF89', '\uD83D\uDE4C'];

function spawnConfetti(container) {
  const delays = confettiEmoji.map((_, i) => i * (50 + Math.random() * 80));
  for (let j = delays.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [delays[j], delays[k]] = [delays[k], delays[j]];
  }
  const laneWidth = 20 / confettiEmoji.length;
  for (let i = 0; i < confettiEmoji.length; i++) {
    const emoji = document.createElement('span');
    emoji.className = 'share-confetti';
    emoji.textContent = confettiEmoji[i];
    emoji.style.left = (40 + laneWidth * i + (Math.random() * 4 - 2)) + '%';
    emoji.style.animationDelay = delays[i] + 'ms';
    emoji.style.animationDuration = (0.8 + Math.random() * 0.5) + 's';
    emoji.style.setProperty('--drift', (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 20) + 'px');
    container.appendChild(emoji);
    emoji.addEventListener('animationend', () => emoji.remove());
  }
}

function spawnConfettiFromBottom() {
  // Create a fixed container at the bottom of the viewport
  const container = document.createElement('div');
  container.className = 'share-confetti-viewport';
  document.body.appendChild(container);
  spawnConfetti(container);
  // Clean up container after all animations finish
  setTimeout(() => container.remove(), 2500);
}

function createShareButton() {
  if (typeof document === 'undefined') return;

  // Remove any previous share button
  document.querySelectorAll('.share-bar').forEach(el => el.remove());

  const container = document.querySelector('article') || document.querySelector('.markdown');
  if (!container) return;

  const bar = document.createElement('div');
  bar.className = 'share-bar';

  const btn = document.createElement('button');
  btn.className = 'share-btn';
  btn.innerHTML = '<span class="share-btn__icon">\uD83D\uDD17</span> <span class="share-btn__text">Share this page</span>';
  btn.setAttribute('aria-label', 'Copy link to clipboard');

  btn.addEventListener('click', () => {
    if (btn.classList.contains('share-btn--done')) return;

    navigator.clipboard.writeText(window.location.href).then(() => {
      btn.classList.add('share-btn--done');
      btn.querySelector('.share-btn__icon').textContent = '\u2714';
      btn.querySelector('.share-btn__text').textContent = 'Link copied!';
      showToast('Link copied to clipboard');
      spawnConfetti(bar);

      setTimeout(() => {
        btn.classList.remove('share-btn--done');
        btn.querySelector('.share-btn__icon').textContent = '\uD83D\uDD17';
        btn.querySelector('.share-btn__text').textContent = 'Share this page';
      }, 2500);
    });
  });

  bar.appendChild(btn);

  // Insert before the last <hr> (above the closing "This page is part of..." section)
  const hrs = container.querySelectorAll('hr');
  const lastHr = hrs.length > 0 ? hrs[hrs.length - 1] : null;
  if (lastHr) {
    lastHr.parentNode.insertBefore(bar, lastHr);
  } else {
    container.appendChild(bar);
  }
}

// =============================================
// Auto-generated mobile TOC
// =============================================
function createMobileTOC() {
  if (typeof document === 'undefined') return;

  // Remove any previous auto-generated TOC
  document.querySelectorAll('.mobile-toc-auto').forEach(el => el.remove());

  // Hide Docusaurus built-in mobile TOC so we use ours everywhere
  document.querySelectorAll('[class*="tocMobile"]').forEach(el => {
    el.style.display = 'none';
  });

  // Find the content container
  const container = document.querySelector('article') || document.querySelector('.markdown');
  if (!container) return;

  // Find h2 and h3 headings with IDs
  const headings = container.querySelectorAll('h2[id], h3[id]');
  if (headings.length < 2) return;

  // Build nested TOC list (h3s nest under preceding h2)
  const ul = document.createElement('ul');
  let currentH2Li = null;

  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);

    if (h.tagName === 'H2') {
      ul.appendChild(li);
      currentH2Li = li;
    } else if (h.tagName === 'H3' && currentH2Li) {
      let subUl = currentH2Li.querySelector('ul');
      if (!subUl) {
        subUl = document.createElement('ul');
        currentH2Li.appendChild(subUl);
      }
      subUl.appendChild(li);
    } else {
      ul.appendChild(li);
    }
  });

  // Add share link as last TOC entry
  const shareLi = document.createElement('li');
  shareLi.className = 'toc-share-item';
  const shareLink = document.createElement('a');
  shareLink.href = '#';
  shareLink.className = 'toc-share-link';
  shareLink.innerHTML = '\uD83D\uDD17 Share this page';
  shareLi.appendChild(shareLink);
  ul.appendChild(shareLi);

  // Create the details/summary wrapper
  const details = document.createElement('details');
  details.className = 'mobile-toc mobile-toc-auto';

  const summary = document.createElement('summary');
  summary.textContent = 'On this page';
  details.appendChild(summary);
  details.appendChild(ul);

  // Insert after the h1 title, or at top of container
  const header = container.querySelector('header');
  if (header && header.nextSibling) {
    header.parentNode.insertBefore(details, header.nextSibling);
  } else {
    const h1 = container.querySelector('h1');
    if (h1 && h1.nextSibling) {
      h1.parentNode.insertBefore(details, h1.nextSibling);
    } else {
      container.insertBefore(details, container.firstChild);
    }
  }
}

// =============================================
// Desktop sidebar TOC — inject share link
// =============================================
function injectDesktopShareLink() {
  if (typeof document === 'undefined') return;

  // Remove any previous injected share links in desktop TOC
  document.querySelectorAll('.desktop-toc-share').forEach(el => el.remove());

  // Find the Docusaurus desktop sidebar TOC
  const tocContainer = document.querySelector('[class*="tableOfContents"]');
  if (!tocContainer) return;
  const tocUl = tocContainer.querySelector('ul');
  if (!tocUl) return;

  const li = document.createElement('li');
  li.className = 'desktop-toc-share';
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'toc-share-link table-of-contents__link';
  a.innerHTML = '\uD83D\uDD17 Share this page';
  li.appendChild(a);
  tocUl.appendChild(li);
}

// Docusaurus lifecycle hook — fires after every route change
export function onRouteDidUpdate({location, previousLocation}) {
  setTimeout(createMobileTOC, 200);
  setTimeout(createShareButton, 300);
  setTimeout(injectDesktopShareLink, 300);
}
