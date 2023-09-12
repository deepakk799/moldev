/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const META_SHEET_MAPPING = [
  { url: '/newsroom/in-the-news/', sheet: 'publications' },
  { url: '/products/', sheet: 'products-diff' },
  { url: '/service-support/', sheet: 'products' },
  { url: '/applications/', sheet: 'applications-diff' },
  { url: '/events/', sheet: 'events' },
  { url: '/resources/citations/', sheet: 'citations' },
  { url: '/technology', sheet: 'technologies-diff' },
  { url: '/lab-notes', sheet: 'blog' },
  { url: '/en/assets/customer-breakthrough', sheet: 'customer-breakthrough' },
];

const COUNTRY_MAPPING = [{ country: 'China', locale: 'ZH' }];

const EXPORT_URL = 'https://main--moleculardevices--hlxsites.hlx.page/drafts/export/moldev-resources-sheet-06292023-china.json';

const formatDate = (date, includeTime = false) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    return date.toLocaleString('en-US', options);
  }
  return date.toLocaleDateString('en-US', options);
};

const makeUrlRelative = (url) => {
  if (url.startsWith('https://www.moleculardevices.com')) {
    return url.substring(32, url.length);
  }
  return url;
};

/**
 * Special handling for resource document meta data.
 */
const loadResourceMetaAttributes = (url, params, document, meta) => {
  let resourceMetadata = [];
  // we use old XMLHttpRequest as fetch seams to have problems in bulk import
  const request = new XMLHttpRequest();
  let sheet = 'resources';
  const metaSheet = META_SHEET_MAPPING.find((m) => params.originalURL.indexOf(m.url) > -1);
  if (metaSheet) {
    sheet = metaSheet.sheet;
  }
  request.open('GET', `${EXPORT_URL}?limit=10000&sheet=${sheet}`, false);
  request.overrideMimeType('text/json; UTF-8');
  request.send(null);
  if (request.status === 200) {
    resourceMetadata = JSON.parse(request.responseText).data;
  }

  let {originalURL} = params;
  if (originalURL.startsWith('https://live-md30.pantheonsite.io')) {
    originalURL = originalURL.replace('https://live-md30.pantheonsite.io', 'https://www.moleculardevices.com');
  }

  const resource = resourceMetadata.find((n) => n.url === originalURL);
  if (resource) {
    if (resource['new news url']) {
      const newNewsUrl = resource['new news url'];
      document.newPath = newNewsUrl.startsWith('https://live-md30.pantheonsite.io/') ? newNewsUrl.replace('https://live-md30.pantheonsite.io/', '/') : newNewsUrl;
    }
    if (resource['asset type']) {
      document.type = resource['asset type'];
      if (document.type === 'Category') {
        meta.Template = 'Category';
      }
    }
    if (!meta.Title) {
      meta.Title = resource.title;
    }
    if (resource['tagged to products']) {
      meta['Related Products'] = resource['tagged to products'];
    }
    if (resource['tagged to technology']) {
      meta['Related Technologies'] = resource['tagged to technology'];
    }
    if (resource['tagged to applications']) {
      meta['Related Applications'] = resource['tagged to applications'];
    }
    if (resource['tagged topics']) {
      meta['Related Topics'] = resource['tagged topics'];
    }
    if (resource['gated/ungated'] === 'Yes') {
      meta.Gated = 'Yes';
      const gatedUrl = resource['gated url'];
      meta['Gated URL'] = gatedUrl.startsWith('http')
        ? gatedUrl
        : `https://www.moleculardevices.com${gatedUrl}`;
    }
    if (resource.publisher) {
      meta.Publisher = resource.publisher;
    }
    if (resource['resource author']) {
      meta.Author = resource['resource author'];
    }
    if (resource['card cta']) {
      meta['Card C2A'] = resource['card cta'];
    }
    if (resource['short description']) {
      if (meta.Description) {
        meta['Card Description'] = resource['short description'];
      } else {
        meta.Description = resource['short description'];
      }
    }
    if (resource.summary) {
      if (meta.Description) {
        meta['Card Description'] = resource.summary;
      } else {
        meta.Description = resource.summary;
      }
    }
    if (resource['coveo title']) {
      meta['Search Title'] = resource['coveo title'];
    }
    if (resource['product category']) {
      meta.Category = resource['product category'];
    }
    if (resource.category) {
      meta.Category = resource.category;
    }
    if (resource['sub category'] && resource['sub category'] !== resource.category) {
      meta['Sub Category'] = resource['sub category'];
    }
    if (resource['product related categories']) {
      meta['Related Categories'] = resource['product related categories'];
    }
    if (resource['product family']) {
      meta['Product Family'] = resource['product family'];
    }
    if (resource['line of business']) {
      meta['Line of Business'] = resource['line of business'];
    }
    if (resource['family id']) {
      meta['Family ID'] = resource['family id'];
      document.pid = resource['family id'];
    }
    if (resource.source) {
      meta.Source = resource.source;
    }
    if (resource.country) {
      meta.Country = resource.country;
      const locale = COUNTRY_MAPPING.find((m) => resource.country === m.country);
      if (locale) meta.Locale = locale.locale;
    }
    if (resource.language) {
      meta.Language = resource.language;
    }
    if (resource.locale) {
      meta.Locale = resource.locale;
    }

    if (params.originalURL.indexOf('/resources/citations/') > 0) {
      if (resource['citation number']) {
        meta['Citation Number'] = resource['citation number'];
      }
    }

    if (params.originalURL.indexOf('/events/') > 0) {
      if (resource['event type']) {
        meta['Event Type'] = resource['event type'];
      }
      if (resource.region) {
        meta['Event Region'] = resource.region;
      }
      if (resource['event address']) {
        meta['Event Address'] = resource['event address'];
      }
      const startDate = new Date(resource['start date']);
      if (startDate) {
        meta['Event Start'] = formatDate(startDate, true);
      }
      const endDate = new Date(resource['end date']);
      if (endDate) {
        meta['Event End'] = formatDate(endDate, true);
      }
    }

    if (resource.thumbnail) {
      const el = document.createElement('img');
      el.src = makeUrlRelative(resource.thumbnail);
      if (params.originalURL.indexOf('/events/') > 0) {
        if (!meta.Image) {
          meta.Image = el;
        }
      } else {
        meta.Thumbnail = el;
      }
    }

    if (resource['created on']) {
      const publishDate = new Date(resource['created on']);
      if (publishDate) {
        meta['Publication Date'] = formatDate(publishDate);
      }
    }
  } else {
    console.warn('Resource item for %s not found', params.originalURL);
  }
};

const loadFragmentIndex = (type, ref) => {
  const request = new XMLHttpRequest();
  request.open(
    'GET',
    'https://main--moleculardevices--hlxsites.hlx.page/fragments/query-index.json?limit=1000',
    false
  );
  request.overrideMimeType('text/json; UTF-8');
  request.send(null);
  let fragments = {};
  if (request.status === 200) {
    fragments = JSON.parse(request.responseText).data;
  }

  // eslint-disable-next-line max-len
  const fragment = fragments.find(
    (n) => n.title.trim().toLowerCase() === ref.trim().toLowerCase() && n.type === type
  );
  if (fragment && fragment.path.startsWith('/')) {
    fragment.path = `https://main--moleculardevices--hlxsites.hlx.page${fragment.path}`;
  }
  return fragment;
};

const createFragmentList = (document, type, fragmentNames) => {
  const linkList = [];
  fragmentNames.forEach((fragmentName) => {
    const fragment = loadFragmentIndex(type, fragmentName);
    if (fragment) {
      const link = document.createElement('a');
      link.href = fragment.path;
      link.textContent = fragment.path;
      linkList.push(link);
    }
  });
  return linkList;
};

const createFragmentTable = (document, url) => {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = a.href;
  const cells = [['Fragment'], [a]];
  return WebImporter.DOMUtils.createTable(cells, document);
};

/**
 * Meta data extraction form the original page
 */
const createMetadata = (url, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML
      .replace(/[\n\t]/gm, '')
      .replace(/\|.*/, '')
      .replace(/&amp;/, '&')
      .trim();
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && ogTitle.content !== meta.Title) {
    meta['og:title'] = ogTitle.content;
  }

  const desc = document.querySelector('meta[name="description"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
    if (ogDesc) {
      meta['og:description'] = ogDesc.content;
      meta['twitter:description'] = ogDesc.content;
    }
  } else if (ogDesc) {
    meta.Description = ogDesc.content;
  }

  const keywords = document.querySelector('meta[name="keywords"]');
  if (keywords) {
    meta.Keywords = keywords.content;
  }

  const img = document.querySelector('meta[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    const imgUrl = img.content;
    el.src = makeUrlRelative(imgUrl);
    meta.Image = el;
  }

  if (document.querySelector('body.page-node-type-landing-pages')) {
    meta.Template = 'Landing Page';
    document.type = 'Landing Page';
  }
  return meta;
};

/**
 * Sanitizes a name for use as class name.
 * @param {string} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return typeof name === 'string'
    ? name
        .toLowerCase()
        .replace(/[^0-9a-z]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';
}

const cleanUp = (document) => {
  document.querySelectorAll('table').forEach((table) => {
    table.innerHTML = table.innerHTML.replace(/\\~/gm, '~');
  });
  document
    .querySelectorAll('.row [class*="col-"][class*="-12"]')
    .forEach((col) => col.classList.remove('col-xs-12', 'col-sm-12', 'col-md-12', 'col-lg-12'));
  document.querySelectorAll('.content-section .listing-image.ico-list').forEach((div) => {
    if (div.textContent.trim() === '') {
      div.remove();
    }
  });

  // remove green default wave from pages as we are going to inject the fragment into every tab
  document
    .querySelectorAll('div.content-section.cover-bg.curv-footer-top-section')
    .forEach((wave) => wave.remove());

  // remove empty media gallery with not items
  const mediaGallery = document.querySelector('div#mediaGallary');
  if (mediaGallery) {
    if (
      mediaGallery.querySelector('.carousel-inner') &&
      mediaGallery.querySelector('.carousel-inner').childElementCount === 0
    ) {
      mediaGallery.remove();
    }
  }
};

const extractBackgroundImage = (content) => {
  const { backgroundImage } = content.style;
  if (backgroundImage && backgroundImage.match(/url\((.*?)\)/)) {
    return makeUrlRelative(backgroundImage.match(/url\((.*?)\)/)[1].trim());
  }

  // fallback and check on attributes
  const style = content.hasAttribute('style')
    ? content.getAttribute('style').replace(/(\r\n|\n|\r)/gm, '')
    : null;

  if (style && style.match(/background-image: url(?:\(['"]?)(.*?)(?:['"]?\))/)) {
    const backgroundUrl = style.match(/background-image: url(?:\(['"]?)(.*?)(?:['"]?\))/)[1];
    return backgroundUrl ? makeUrlRelative(backgroundUrl.trim()) : null;
  }
  return null;
};

const transformHero = (document) => {
  // detect the default hero styles
  document
    .querySelectorAll(
      '.section-image.cover-bg, .section-image.cover-bg-new, section.video-banner.message-banner'
    )
    .forEach((hero) => {
      // clean
      hero.querySelectorAll('.row').forEach((row) => row.removeAttribute('class'));

      // extract hero image
      const backgroundUrl = extractBackgroundImage(hero);
      let backgroundImg = null;
      if (backgroundUrl) {
        backgroundImg = document.createElement('img');
        backgroundImg.src = backgroundUrl;
      }

      // extract mobile image
      let mobileBackgroundImg = null;
      if (hero.querySelector('div.visible-xs-block > img')) {
        const mobileBackgroundDiv = hero.querySelector('div.visible-xs-block');
        mobileBackgroundImg = mobileBackgroundDiv.querySelector('img');
        mobileBackgroundDiv.remove();
      }

      // extract hero video
      let videoLink = null;
      if (hero.querySelector('.video-container')) {
        const videoOverlay = hero.querySelector('.video-container');
        const video = videoOverlay.querySelector('a[onclick]').getAttribute('onclick');

        const regex = /launchLightbox\('(.*)'\)|fn_vidyard_(.*)\(\)/;
        let m;
        // eslint-disable-next-line no-cond-assign
        if ((m = regex.exec(video)) !== null) {
          const videoId = m[1] || m[2];
          if (videoId) {
            videoLink = `https://share.vidyard.com/watch/${videoId}`;
          }
        }
        videoOverlay.remove();
      }

      const cells = [['Hero']];
      const isBlog = hero.classList.contains('blog-details');

      // extract gallery links
      let heroFilterLinks = null;
      const heroFilterContainer = hero.querySelector('.product-res-filter');
      if (heroFilterContainer) {
        heroFilterContainer.remove('.active-filter');
        heroFilterLinks = heroFilterContainer.querySelector('.views-element-container ul');
        if (heroFilterLinks) {
          cells[0] = ['Hero (Filter)'];
        }
      }

      // prepare hero content
      const heroContent = isBlog
        ? hero.querySelector('.hero-desc')
        : hero.querySelector('.container');
      if (heroContent.querySelector('.btn-wrap-mb')) {
        const buttons = heroContent.querySelector('.btn-wrap-mb').children;
        [...buttons].forEach((button) => {
          const buttonWrapper = document.createElement('p');
          button.parentNode.insertBefore(buttonWrapper, button);
          buttonWrapper.append(button);
        });
      }

      // prepare testimonials inside the hero
      heroContent.querySelectorAll('.testimonials').forEach((quote) => {
        const author = quote.querySelector('label');
        if (author) {
            const wrapper = document.createElement('p');
            wrapper.textContent = author.textContent;
            author.replaceWith(wrapper);
        }
      });

      const row = [heroContent];

      // add video link
      if (videoLink) {
        row.push([videoLink]);
      }

      // handle product pages with advanced header
      if (isProduct(document) && !isAssayKit(document)) {
        cells[0] = ['Hero Advanced'];
        if (backgroundImg) {
          cells.push(['Desktop', backgroundImg]);
        }
        if (mobileBackgroundImg) {
          cells.push(['Mobile', mobileBackgroundImg]);
        }
      } else {
        if (isBlog) {
          cells[0] = ['Hero (Blog)'];
        }
        const isOrangeStyle = hero.querySelector('a.orangeBlueBtn');
        if (isOrangeStyle) {
          cells[0] = ['Hero (Orange Buttons)'];
        }

        if (backgroundImg) {
          heroContent.insertBefore(backgroundImg, heroContent.firstChild);
        }

        // add second column for customer success story
        const customerStoryHeader = hero.parentElement.querySelector('.customer-story-section');
        if (customerStoryHeader) {
          customerStoryHeader.querySelectorAll('.customer-info label').forEach((label) => {
            const h6 = document.createElement('h6');
            h6.innerHTML = label.innerHTML;
            label.replaceWith(h6);
          });
          cells[0] = ['Hero (Customer Story)'];
          row.push([customerStoryHeader]);
        }
      }

      cells.push(row);
      if (heroFilterLinks) {
        cells.push([heroFilterLinks]);
      }

      const table = WebImporter.DOMUtils.createTable(cells, document);
      hero.replaceWith(table);
    });

  // detect the waved "ebook" style hero used on most gates pages plus some others
  document.querySelectorAll('.ebook-banner.wave, .ebook-banner.reversewave').forEach((hero) => {
    const cells = hero.classList.contains('reversewave')
      ? [['Hero (wave, reverse)']]
      : [['Hero (wave)']];
    const heroContent = hero.querySelector('.mol-content');
    const heroThumbnail = hero.querySelector('.mol-img');
    const backgroundUrl = extractBackgroundImage(hero);
    if (backgroundUrl) {
      const img = document.createElement('img');
      img.src = backgroundUrl;
      cells.push([img]);
    }
    cells.push([heroContent, heroThumbnail]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    hero.replaceWith(table);
  });
};

// we have different usages of sections - with <section></section>, <div></div>
const transformSections = (document) => {
  document
    .querySelectorAll('section * section:not(.blogsPage), .category-page-section')
    .forEach((section) => {
      // if (index > 0) {
      // section.firstChild.before(document.createElement('hr'));
      // }
      const cells = [['Section Metadata']];
      const styles = [];
      if (section.classList.contains('grey_molecules_bg_top')) {
        styles.push('Background Molecules');
      }
      if (section.classList.contains('parallax-container1')) {
        styles.push('Background Parallax');
      }
      if (section.classList.contains('franklin-horizontal')) {
        styles.push('Columns 2');
      }
      if (section.classList.contains('greyBg') || section.classList.contains('bg-gray')) {
        styles.push('Background Grey');
      }
      if (styles.length > 0) {
        cells.push(['style', styles.toString()]);
      }

      if (cells.length > 1) {
        const table = WebImporter.DOMUtils.createTable(cells, document);
        section.after(table, document.createElement('hr'));
      }
    });
};

const transformButtons = (document) => {
  // convert primary/secondary buttons
  document.querySelectorAll('a.btn').forEach((button) => {
    //button.querySelectorAll('span').forEach((span) => span.remove());
    button.querySelectorAll('i.fa').forEach((icon) => {
      button.textContent = `${button.textContent} :${icon.classList[1]}:`;
      icon.remove();
    });
  });

  // convert primary buttons
  document.querySelectorAll('a.btn-info, a.gradiantBlueBtn, a.orangeBlueBtn').forEach((button) => {
    const wrapper = document.createElement('strong');
    wrapper.innerHTML = button.outerHTML;
    button.replaceWith(wrapper);
  });

  // convert secondary buttons
  document
    .querySelectorAll(
      'a.gradiantTealreverse, a.gradiantOrangereverse, a.whiteBtn, a.banner_btn.bluebdr-mb, a.banner_btn'
    )
    .forEach((button) => {
      const wrapper = document.createElement('em');
      wrapper.innerHTML = button.outerHTML;
      button.replaceWith(wrapper);
    });

  // convert links with icons
  document.querySelectorAll('a.linkBtn').forEach((button) => {
    button.querySelectorAll('i.icon-icon_link').forEach((icon) => {
      const iconName = icon.classList[0].substring(5, icon.classList[0].lenght);
      button.textContent = `${button.textContent} :${iconName}:`;
      icon.remove();
    });
  });
};

const transformTables = (document) => {
  document.querySelectorAll('.table-responsive table, table.table').forEach((table) => {
    // clean up <br> tags
    table.querySelectorAll('td, th').forEach((td) => {
      if (td.querySelector('br')) {
        [...td.childNodes].forEach((c) => {
          if (c.nodeType === Node.TEXT_NODE) {
            const p = document.createElement('p');
            p.textContent = c.textContent;
            c.replaceWith(p);
          }
          if (c.nodeName === 'BR') {
            c.remove();
          }
        });
      }
    });

    // get number of columns
    // eslint-disable-next-line max-len
    const numCols = table.rows[0]
      ? [...table.rows[0].cells].reduce((cols, cell) => cols + cell.colSpan, 0)
      : 0;

    // convert caption into header row
    table.querySelectorAll('caption').forEach((caption) => {
      const tr = table.insertRow(0);
      const th = document.createElement('th');
      th.textContent = caption.textContent;
      th.setAttribute('colspan', numCols);
      tr.append(th);
      table.deleteCaption();
    });

    // convert rows th > td
    table.querySelectorAll('tr').forEach((row) => {
      [...row.children].forEach((item) => {
        if (item.nodeName === 'TH') {
          const newTd = document.createElement('td');
          newTd.innerHTML = item.innerHTML;
          if (item.hasAttribute('colspan')) {
            newTd.setAttribute('colspan', item.getAttribute('colspan'));
          }
          item.replaceWith(newTd);
        }
      });
    });

    // create block table head row
    const tr = table.insertRow(0);
    const th = document.createElement('th');
    const options = [];
    if (table.closest('#Order')) options.push('Order');
    if (table.classList.contains('cm-product-table')) options.push('Options Compare');
    th.textContent = options.length > 0 ? `Table (${options.join(',')})` : 'Table';
    th.setAttribute('colspan', numCols);
    tr.append(th);
  });
};


const transformImageCaption = (document) => {
  [
    ...document.querySelectorAll('p.text-caption'),
    ...document.querySelectorAll('p.caption'),
  ].forEach((caption) => {
    const captionWrapper = document.createElement('em');
    captionWrapper.innerHTML = caption.innerHTML;
    caption.replaceWith(captionWrapper);

    if (captionWrapper.previousElementSibling) {
      const previousNodeName = captionWrapper.previousElementSibling.nodeName;
      if (previousNodeName === 'BR' || previousNodeName === 'A') {
        if (previousNodeName === 'BR') captionWrapper.previousElementSibling.remove();
        const paragraphWrapper = document.createElement('p');
        paragraphWrapper.innerHTML = captionWrapper.outerHTML;
        captionWrapper.replaceWith(paragraphWrapper);
      }
    }
  });
};

const transformImageLinks = (document) => {
  document.querySelectorAll('a img, a picture').forEach((image) => {
    const link = image.closest('a');
    link.before(image, document.createElement('br'));
    if (link.textContent.trim() === '') {
      link.textContent = link.href;
    }
  });
};


const transformHashLinks = (document) => {
  document.querySelectorAll('[href*="#"]').forEach((link) => {
    if (link.href && link.href.indexOf('about:blank#') > -1) {
      const hashId = link.href.substring(link.href.lastIndexOf('#') + 1);
      const idElement = document.getElementById(hashId);
      if (idElement) {
        const newHash = toClassName(idElement.textContent);
        const path = WebImporter.FileUtils.sanitizePath(
          new URL(document.originalURL).pathname.replace(/\.html$/, '').replace(/\/$/, '')
        );
        link.href = `${path}#${newHash}`;
      }
    }
  });
};



// convert embed objects
const transformEmbeds = (document) => {
  // detect ceros embeds
  document.querySelectorAll('.ceros-overview').forEach((ceros) => {
    const container = ceros.closest('.video-container');
    const cerosUrl = ceros.getAttribute('data-url');
    if (container && cerosUrl) {
      container.querySelectorAll('.modal#cerospop_overview').forEach((m) => m.remove());
      const img = container.querySelector('img');
      const title = container.querySelector('p');
      const wrapper = document.createElement('div');
      wrapper.append(img, cerosUrl, title);
      const cells = [['Ceros'], [wrapper]];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      container.replaceWith(table);
    }
  });

  // detect vidyard video player embeds using v4 code
  document.querySelectorAll('.vidyard-player-embed').forEach((vidyard) => {
    const videoId = vidyard.getAttribute('data-uuid');
    if (!videoId) return;
    const type = vidyard.getAttribute('data-type');
    const videoContainer = vidyard.closest('.video-container');

    const videoLink = document.createElement('a');
    videoLink.href = `https://share.vidyard.com/watch/${videoId}`;
    if (videoContainer && videoContainer.querySelector('p')) {
      videoLink.append(videoContainer.querySelector('p'));
    } else {
      videoLink.textContent = videoLink.href;
    }

    if (type === 'inline') {
      const videoWrapper = document.createElement('em');
      videoWrapper.append(videoLink);
      vidyard.replaceWith(videoWrapper);
    } else {
      vidyard.replaceWith(videoLink);
    }
  });

  // detect embed iframe in main content
  document.querySelectorAll('.container iframe').forEach((iframe) => {
    const iframeSrc = iframe.src;
    if (iframeSrc) {
      const link = document.createElement('a');
      link.href = iframeSrc;
      link.textContent = iframeSrc;
      let cells = [['Embed'], [link]];

      // check if we are inside an `ebook-form` with related heading
      const ebookForm = iframe.closest('.ebook-form');
      if (ebookForm && ebookForm.querySelector('h4')) {
        const wrapper = document.createElement('div');
        wrapper.append(ebookForm.querySelector('h4'), link);
        cells = [['Embed'], [wrapper]];
      }
      const table = WebImporter.DOMUtils.createTable(cells, document);
      iframe.replaceWith(table);
    }
  });
};

function makeAbsoluteLinks(main, url) {
  const HOST = 'https://main--moleculardevices--hlxsites.hlx.page/';
  const pagePath = WebImporter.FileUtils.sanitizePath(
    new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')
  );

  main.querySelectorAll('a').forEach((a) => {
    if (!a.href) {
      a.href = pagePath + a.name;
    }
    if (a.href.startsWith('/')) {
      const ori = a.href;
      const u = new URL(a.href, HOST);

      // Remove .html extension
      if (u.pathname.endsWith('.html')) {
        u.pathname = u.pathname.slice(0, -5);
      }

      a.href = u.toString();

      if (a.textContent === ori) {
        a.textContent = a.href;
      }
    }
    if (a.href.startsWith('http://localhost:3001')) {
      a.href = a.href.replaceAll('http://localhost:3001/', HOST);
      a.textContent = a.textContent.replaceAll('http://localhost:3001/', HOST);
    }
  });
}

export default {
  /**
   * Apply DOM pre processing
   * @param {HTMLDocument} document The document
   */
  preprocess: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) => {
    // try to fix malformed URLs
    document.querySelectorAll('a').forEach((a) => {
      const { href } = a;
      try {
        decodeURI(href);
      } catch (error) {
        console.warn(`Invalid link in the page: ${href}`, error);
        // TODO
        // a.href = new URL(href).toString();
        a.href = '';
      }

      if (href.startsWith('https://www.moleculardevices.com')) {
        a.href = href.substring(32, href.length);
      }
    });

    // try to fix malformed img src
    document.querySelectorAll('img').forEach((img) => {
      img.src = img.src.trim();
    });

    // prepare vidyard script URLs before their are filtered
    document.querySelectorAll('.video script').forEach((vidyard) => {
      const scriptsToTest = ['ceros', 'embed/v4.js'];
      if (vidyard.src && !scriptsToTest.some((script) => vidyard.src.includes(script))) {
        const videoDiv = vidyard.parentElement;
        videoDiv.classList.add('vidyard-player-embed');
        const videoUuid = vidyard.src.match(/.*com\/(.*)\.js/)[1];
        const videoParams = new URLSearchParams(vidyard.src);
        videoDiv.setAttribute('data-url', vidyard.src);
        videoDiv.setAttribute('data-uuid', videoUuid);
        videoDiv.setAttribute('data-type', videoParams.get('type'));
      }
    });

    // rewrite picture tags to img only
    document.querySelectorAll('picture').forEach((picture) => {
      const img = picture.querySelector('img');
      if (img) {
        img.srcset = '';
        picture.replaceWith(img);
      }
    });

    // rewrite all links with spans before they get cleaned up
    document.querySelectorAll('a span.text').forEach((span) => span.replaceWith(span.textContent));
    document
      .querySelectorAll('a strong')
      .forEach((strong) => strong.replaceWith(strong.textContent));
  },

  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'style',
      'header',
      'footer',
      'noscript',
      'nav#block-mobilenavigation',
      'body > div#mediaGallary', // remove the hero media gallery only
      '.blog-details .hero-desc ul', // blog author & date which we read from meta data
      '.breadcrumb',
      '.skip-link',
      '.procompare',
      '.share-event',
      '.sticky-social-list',
      '.back-labnote',
      '.recent-posts .overview-page',
      '.blogContentBox .image_modal.modal',
      '.visually-hidden.focusable.skip-link',
      '.ins-nav-container',
      '.bannerWrap .OneLinkShow_zh',
      '.pro-comparison-result',
      '.onetrust-consent-sdk',
      '.drift-frame-chat',
      '.drift-frame-controller',
      '.page-node-type-events .button-wrap .linkBtn.blue', // add to calender button on events
      '.content-section.cover-bg.curv-footer-top-section.white-text.lab-autm-pages',
      'img.new-tag', // to be checked
      '.w-auto.cm-cart-counter',
      '.bannerInnerPages .cart_wrap',
      '#product-image-modal', // TODO
      'i.fa', // all fontawesome icons
    ]);

    // create the metadata block and append it to the main element
    document.originalURL = params.originalURL;
    const meta = createMetadata(url, document);
    loadResourceMetaAttributes(url, params, document, meta);

    const block = WebImporter.Blocks.getMetadataBlock(document, meta);
    main.append(block);

    // convert all blocks
    [
      cleanUp,
      transformSections,
      transformHero,
      transformTables,
      transformButtons,
      transformEmbeds,
      transformImageCaption,
      transformHashLinks,
      transformImageLinks,
    ].forEach((f) => f.call(null, document));

    makeAbsoluteLinks(document, url);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */

  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) => {
    if (document.newPath) {
      return WebImporter.FileUtils.sanitizePath(document.newPath);
    }
    return WebImporter.FileUtils.sanitizePath(
      new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')
    );
  },
};
