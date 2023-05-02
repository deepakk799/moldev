import { createOptimizedPicture, getMetadata } from '../../scripts/lib-franklin.js';
import { formatDate } from '../../scripts/scripts.js';
import { div, i, span, a } from '../../scripts/dom-helpers.js';

function addMetadata(container) {
  const publishDate = formatDate(getMetadata('publication-date'), { month: 'long' });
  const author = getMetadata('author');
  container.appendChild(
    div(
      { class: 'metadata' },
      div(i({ class: 'fa fa-calendar' }), span({ class: 'blog-publish-date' }, ` ${publishDate}`)),
      author ? div(i({ class: 'fa fa-user' }), span({ class: 'blog-author' }, ` ${author}`)) : '',
    ),
  );
}

async function addBlockSticker(container) {
  const stickerPicture = document.createElement('picture');
  stickerPicture.innerHTML = `
    <source type="image/webp" srcset="/images/lab-notes-hero-sticker.webp">
    <img loading="lazy" alt="Molecular Devices Lab Notes" type="image/png" src="/images/lab-notes-hero-sticker.png">
  `;

  container.appendChild(div({ class: 'sticker' }, a({ href: '/lab-notes' }, stickerPicture)));
}

async function loadBreadcrumbs(breadcrumbsContainer) {
  const breadCrumbsModule = await import('../breadcrumbs/breadcrumbs-create.js');
  breadCrumbsModule.default(breadcrumbsContainer);
}

export function buildHero(block) {
  const inner = document.createElement('div');
  inner.classList.add('hero-inner');
  const container = document.createElement('div');
  container.classList.add('container');

  let picture = block.querySelector('picture');
  if (picture) {
    const originalHeroBg = picture.lastElementChild;
    const optimizedHeroBg = createOptimizedPicture(
      originalHeroBg.src,
      originalHeroBg.getAttribute('alt'),
      true,
      [
        { media: '(max-width: 575px)', width: '575' },
        { media: '(max-width: 767px)', width: '767' },
        { media: '(max-width: 1199px)', width: '1200' },
        { width: '1950' },
      ],
    );

    picture.replaceWith(optimizedHeroBg);
    picture = optimizedHeroBg;
    picture.classList.add('hero-background');
    inner.prepend(picture.parentElement);
  }

  const rows = block.children.length;
  [...block.children].forEach((row, i) => {
    if (i === rows - 1) {
      if (row.childElementCount > 1) {
        container.classList.add('two-column');
        [...row.children].forEach((column) => {
          container.appendChild(column);
        });
      } else {
        container.appendChild(row);
      }
    } else {
      row.remove();
    }
  });

  const breadcrumbs = document.createElement('div');
  breadcrumbs.classList.add('breadcrumbs');

  block.appendChild(inner);
  inner.appendChild(breadcrumbs);
  inner.appendChild(container);

  if (block.classList.contains('blog')) {
    addMetadata(container);
    addBlockSticker(breadcrumbs);
    block.parentElement.appendChild(container);
  }

  loadBreadcrumbs(breadcrumbs);
}

export default async function decorate(block) {
  buildHero(block);
}
