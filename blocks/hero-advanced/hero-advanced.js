import { isVideo, loadScript } from '../../scripts/scripts.js';
import { buildHero } from '../hero/hero.js';
import { div, img } from '../../scripts/dom-helpers.js';

export function videoButton(container, button, url) {
  const videoId = url.pathname.split('/').at(-1).trim();
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadScript('https://play.vidyard.com/embed/v4.js');
      const overlay = div({ id: 'overlay' }, div({ class: 'vidyard-player-embed', 'data-uuid': videoId, 'dava-v': '4', 'data-type': 'lightbox', 'data-autoplay': '2' }));
      container.prepend(overlay);
      button.addEventListener('click', () => {
        VidyardV4.api.getPlayersByUUID(videoId)[0].showLightbox();
      });
    }
  });
  observer.observe(container);
}

export default async function decorate(block) {
  const h1 = block.querySelector('h1');
  const desktop = block.querySelector('div');
  h1.parentNode.insertBefore(desktop.querySelector('div:nth-child(2)'), h1);
  desktop.remove();
  const mobile = block.querySelector('div');
  h1.parentNode.insertBefore(mobile.querySelector('div:nth-child(2)'), h1.nextSibling);
  mobile.remove();
  const links = block.querySelectorAll('a');
  [...links].forEach((link) => {
    const url = new URL(link);
    if (isVideo(url)) {
      const container = link.parentElement;
      container.classList.add('video-column');
      const videoIcon = div({ class: 'video-icon' });
      const thumbnail = img({ src: '/images/play_icon.png' });
      videoIcon.append(thumbnail);
      container.appendChild(videoIcon);
      videoButton(container, thumbnail, url);
      link.remove();
    }
  });
  buildHero(block);
}
