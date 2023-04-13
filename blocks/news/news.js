import {
  readBlockConfig,
  toClassName,
} from '../../scripts/lib-franklin.js';
import ffetch from '../../scripts/ffetch.js';
import { formatDate } from '../../scripts/scripts.js';
import createList from '../../scripts/list.js';

function linkPicture(picture) {
  const checkAndAppendLink = (anchor) => {
    if (anchor && anchor.textContent.trim().startsWith('https://')) {
      anchor.innerHTML = '';
      anchor.className = '';
      anchor.appendChild(picture);
    }
  };

  // Handle case where link is directly after image, or with a <br> between.
  let nextSib = picture.nextElementSibling;
  if (nextSib?.tagName === 'BR') {
    const br = nextSib;
    nextSib = nextSib.nextElementSibling;
    br.remove();
  }

  if (nextSib?.tagName === 'A') {
    checkAndAppendLink(nextSib);
    return;
  }

  // Handle case where link is in a separate paragraph
  const parent = picture.parentElement;
  const parentSibling = parent.nextElementSibling;
  if (parent.tagName === 'P' && parentSibling?.tagName === 'P') {
    const maybeA = parentSibling.children?.[0];
    if (parentSibling.children?.length === 1 && maybeA?.tagName === 'A') {
      checkAndAppendLink(maybeA);
      if (parent.children.length === 0) {
        parent.remove();
      }
    }
  }
}

export function decorateLinkedPictures(block) {
  block.querySelectorAll('picture').forEach((picture) => {
    linkPicture(picture);
  });
}

function unixToDate(unixDateString) {
  const date = new Date(0);
  date.setUTCSeconds(unixDateString);
  return date;
}

function unixDateToString(unixDateString) {
  const date = unixToDate(unixDateString);
  const day = (date.getDate()).toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatDateFullYear(unixDateString) {
  const date = unixToDate(unixDateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
  });
}

function filterEntries(entries, activeFilters) {
  let filteredEntries = entries;
  if (activeFilters.year) {
    filteredEntries = filteredEntries
      .filter((n) => toClassName(n.filterDate).includes(activeFilters.year));
  }
  return filteredEntries;
}

function createFilters(entries, activeFilters, createDropdown) {
  const date = Array.from(new Set(entries.map((n) => n.filterDate)));
  return [
    createDropdown(date, activeFilters.year, 'select-year', 'Select Year'),
  ];
}

export async function createOverview(
  block,
  entries,
  limit,
  paginationLimit,
  showDescription,
  viewMoreText,
) {
  block.innerHTML = '';
  entries.forEach((n) => {
    n.filterDate = formatDateFullYear(n.date);
    n.date = formatDate(unixDateToString(n.date));
    if (!showDescription) {
      n.description = '';
    }
    if (viewMoreText) {
      n.viewMoreText = viewMoreText;
    }
  });

  const panelTitle = 'Filter By :';
  await createList(
    entries,
    filterEntries,
    createFilters,
    limit,
    paginationLimit,
    block,
    panelTitle);
}

export async function fetchEntries(type) {
  const entries = await ffetch('/query-index.json')
    .sheet(type)
    .all();
  return entries;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const limit = parseInt(config.limit, 10) || 10;
  const paginationLimit = parseInt(config.paginationLimit, 9) || 9;
  const entries = await fetchEntries('news');
  const showDescription = false;
  const viewMoreText = '';
  // console.log(`found ${entries.length} entries`);
  await createOverview(block, entries, limit, paginationLimit, showDescription, viewMoreText);
}
