.cards > ul {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.cards > ul > li {
  background-color: var(--background-color);
  border: 1px solid var(--highlight-background-color);
}

.cards .cards-card-body {
  margin: 16px;
  position: relative;
}

.cards .cards-card-image {
  line-height: 0;
}

.cards .cards-card-image picture {
  display: block;
}

.cards .cards-card-body > *:first-child {
  margin-top: 0;
}

.cards > ul > li img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  width: 100%;
}

/* LEADERSHIP MODAL */
.leadership-modal {
  left: 0;
  margin: auto;
  transform: translateY(-20%);
  max-width: 900px;
  position: fixed;
  right: 0;
  top: 20px;
  width: 100%;
}

.leadership-modal-overlay {
  background-color: rgb(0 0 0/ 80%);
  bottom: 0;
  cursor: pointer;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
}

.leadership-modal,
.leadership-modal-overlay {
  opacity: 0;
  transition: all 0.3s ease-in-out;
  visibility: hidden;
  z-index: -1;
}

.leadership-modal.show,
.leadership-modal-overlay.show {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.leadership-modal.show {
  z-index: 9999;
}

.leadership-modal-overlay.show {
  z-index: 999;
}

.leadership-modal-close {
  background: transparent;
  border: 1px solid;
  border-radius: 50%;
  color: var(--text-white);
  display: block;
  font-size: 58px;
  height: 48px;
  line-height: 50px;
  margin: 0 auto 10px;
  margin-right: 0;
  min-width: auto;
  padding: 0;
  width: 48px;
}

.leadership-modal-close:hover {
  color: var(--text-white);
}

.leadership-modal-body {
  overflow: hidden;
  position: relative;
}

.leadership-modal-body .leadership-modal-carousel-content::-webkit-scrollbar {
  display: none;
}

.leadership-modal-body .leadership-modal-carousel-content {
  background-color: var(--background-color);
  background-image: url('images/grey_molecules_tp.png'), url('images/grey_molecules.png');
  background-position: center top, center bottom;
  background-repeat: no-repeat;
  background-size: 140% auto, 100% auto;
  height: calc(100% - 60px);
  -ms-overflow-style: none;
  overflow-y: auto;
  padding: 86px 50px 70px;
  scrollbar-width: none;
}

.leadership-modal-body .cards-card-image img {
  display: block;
  height: auto;
  margin: auto;
  max-width: 100%;
  width: 100%;
}

.leadership-modal-body .cards-card-body,
.leadership-modal-body .cards-card-body p {
  font-size: var(--body-font-size-xs);
}

.leadership-modal-body .cards-card-body h2 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 0;
}

.leadership-modal-body .cards-card-body h4 {
  font-weight: 600;
  padding-bottom: 10px;
  padding-top: 5px;
}

.leadership-modal-body .cards-card-body p:first-child {
  margin-top: 0;
}

.leadership-modal-carousel-item {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.leadership-modal-footer a {
  align-items: center;
  color: var(--text-white);
  display: flex;
  font-size: var(--body-font-size-s);
  font-weight: bold;
}

.leadership-modal-pagination {
  align-items: center;
  background: var(--button-secondary-hover-color);
  bottom: 0;
  display: flex;
  justify-content: space-between;
  left: 0;
  padding: 20px 50px;
  position: absolute;
  width: 100%;
}

.leadership-modal-pagination a {
  color: var(--text-white);
}

.leadership-modal-pagination .prev-item a > i {
  margin-right: 10px;
}

.leadership-modal-pagination .next-item a > i {
  margin-left: 10px;
}

.leadership-modal-carousel-nav > div {
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
}

.leadership-modal-carousel-nav > .prev-item {
  left: -40px;
}

.leadership-modal-carousel-nav > .next-item {
  right: -40px;
}

.leadership-modal-carousel-nav > div a {
  font-size: 36px;
}

/* LEADERSHIP MODAL */

.leadership-transition {
  transition: transform 1s ease;
}

/* ================ Leadership Block ================ */
.cards.leaders {
  padding: 50px 0;
}

.cards.leaders > ul {
  display: flex;
  flex-wrap: wrap;
  grid-gap: 0;
}

.cards.leaders > ul > li {
  background-color: var(--background-color);
  box-shadow: 0 2px 10px 3px #ccc;
  flex-basis: 100%;
  margin-bottom: 30px;
}

.cards.leaders > ul > li img {
  aspect-ratio: unset;
}

.cards.leaders > ul > li > div.cards-card-image,
.cards.leaders > ul > li > div.cards-card-body {
  cursor: pointer;
}

.cards.leaders > ul > li > div.cards-card-body {
  margin-bottom: 10px;
  margin-top: 20px;
}

.cards.leaders > ul > li > div.cards-card-body h2 {
  color: var(--text-color);
  font-family: var(--ff-proxima-regular);
  font-size: var(--heading-font-size-l);
  font-weight: bold;
  margin: 0 0 10px;
}

.cards.leaders > ul > li > div.cards-card-body h4 {
  color: var(--text-color);
  display: block;
  font-size: var(--heading-font-size-s);
  line-height: 18px;
  margin: 0;
}

.cards.leaders > ul > li > div.cards-card-body:last-child {
  display: none;
}

@media only screen and (min-width: 480px) {
  .cards.leaders > ul {
    margin: 0 -15px;
  }

  .cards.leaders > ul > li {
    flex-basis: calc(50% - 30px);
    margin: 0 15px 50px;
  }
}

@media only screen and (min-width: 768px) {
  .leadership-modal-wrapper,
  .leadership-modal-body {
    height: 500px;
  }

  .leadership-modal-wrapper {
    height: 500px;
    overflow-y: auto;
  }

  .leadership-modal-body .cards-card-image {
    float: right;
    margin-left: 50px;
    max-width: 300px;
  }
}

@media only screen and (min-width: 992px) {
  .cards.leaders > ul > li {
    flex-basis: calc(33.33% - 30px);
  }
}

@media only screen and (max-width: 767px) {
  .leadership-modal {
    padding: 10px;
  }

  .leadership-modal-close {
    font-size: 40px;
    height: 40px;
    line-height: 40px;
    width: 40px;
  }

  .leadership-modal-wrapper {
    height: 80vh;
    overflow-y: auto;
  }

  .leadership-modal-body .leadership-modal-carousel-content {
    padding: 50px 10px 40px;
  }

  .leadership-modal-body .cards-card-image {
    margin-bottom: 30px;
  }

  .leadership-modal-footer a {
    font-size: var(--body-font-size-xs);
  }

  .leadership-modal-footer .leadership-modal-pagination {
    margin: 0 10px;
    padding: 20px 10px;
    width: calc(100% - 20px);
  }

  .leadership-modal-footer .leadership-modal-carousel-nav {
    display: none;
  }
}

/* ================ Leadership Block ================ */

/* ================ GALLERY BLOCK ================ */
.cards.gallery ul > li {
  border: none;
  position: relative;
}

.cards.gallery ul > li > .cards-card-body{
  margin: 0;
  background: rgb(0 117 141 / 80%);
}

.cards.gallery ul > li:hover > .cards-card-body {
  opacity: 1;
  visibility: visible;
}

.cards.gallery ul > li > .cards-card-body:not(:empty) {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: var(--text-white);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all .2s;
}

.cards.gallery.hover-gradient ul > li > .cards-card-body {
  background: linear-gradient(
    to left,
    rgb(21 145 164 / 80%) 0,
    rgb(50 159 121 / 80%) 50%,
    rgb(97 178 73 / 80%) 100%
  );
}

.cards.gallery ul > li > .cards-card-image picture img {
  aspect-ratio: unset;
  display: block;
}

.cards.gallery ul > li > .cards-card-body > a {
  font-family: var(--ff-proxima-regular);
  font-size: 30px;
  color: var(--text-white);
}

/* ================ GALLERY BLOCK ================ */

/* ================ WHO WE ARE BLOCK ================ */
.cards.who-we-are ul {
  gap: unset;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.cards.who-we-are ul > li {
  border: 0;
  text-align: center;
  max-width: 100%;
  width: 100%;
}

.cards.who-we-are ul > li > .cards-card-body code {
  font-family: var(--ff-proxima-regular);
  font-size: var(--body-font-size-m);
}

.cards.who-we-are ul > li > .cards-card-body:first-child > p{
  margin-top: 0;
  margin-bottom: 0;
  transition: all 0.2s;
}

.cards.who-we-are ul > li > .cards-card-body:first-child > p:last-child{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}

.cards.who-we-are ul > li:hover > .cards-card-body:first-child > p,
.cards.who-we-are ul > li > .cards-card-body:first-child > p:first-child {
  opacity: 1;
  visibility: visible;
}

.cards.who-we-are ul > li > .cards-card-body:first-child > p:last-child,
.cards.who-we-are ul > li:hover > .cards-card-body:first-child > p:first-child{
  opacity: 0;
  visibility: hidden;
}

.cards.who-we-are ul > li:hover > .cards-card-body:first-child > p:last-child {
  opacity: 1;
  visibility: visible;
}

.cards.who-we-are ul > li > .cards-card-body:first-child > p > picture img {
  aspect-ratio: auto;
  width: 152px;
  display: block;
  margin: auto;
}

@media only screen and (min-width: 768px) {
  .cards.who-we-are ul > li {
    flex-basis: 50%;
    max-width: 50%;
  }
}

@media only screen and (min-width: 992px) {
  .cards.who-we-are ul > li {
    flex-basis: 33.33%;
    max-width: 33.33%;
  }
}

/* ================ WHO WE ARE BLOCK ================ */

