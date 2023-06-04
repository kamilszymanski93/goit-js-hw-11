import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const loading = document.querySelector('.load');
loading.classList.add('is-hidden');
let lightbox;
let page = 1;
let q = '';
const apiKey = '36752814-0630461e212967e8c9b2204d7';
const searchForm = document.querySelector('.search-form');
const bodyOdy = document.querySelector('.gallery');
axios.defaults.baseURL = 'https://pixabay.com/api/';

// fetch gallery
async function getUl(userRequest, page) {
  const pictureArray = await axios.get(
    `?key=${apiKey}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return pictureArray.data;
}

// load extra 40 pics

function loadMorePics() {
  page += 1;
  lightbox.destroy();
  q = searchForm.searchQuery.value;
  console.log(page);
  getUl(q, page).then(pictureArray => {
    const Pictures = pictureArray.hits
      .map(
        gallery => `<a class= "gallery-link" href="${gallery.largeImageURL}"><div class="photo-card">
        <img src="${gallery.webformatURL}" alt="${gallery.tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
    <b>Likes</b> ${gallery.likes}
  </p>
  <p class="info-item">
    <b>Views</b> ${gallery.views}
  </p>
  <p class="info-item">
    <b>Comments</b> ${gallery.comments}
  </p>
  <p class="info-item">
    <b>Downloads</b> ${gallery.downloads}
  </p>
        </div>
        </div></a>`
      )
      .join('');
    bodyOdy.insertAdjacentHTML('beforeend', Pictures);
    lightbox = new SimpleLightbox('a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
    const allPages = Math.ceil(pictureArray.totalHits / 40);
    if (page >= allPages) {
      loading.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

// get first 40 pics

function galeryCreator(e) {
  e.preventDefault();
  bodyOdy.innerHTML = '';
  loading.classList.add('is-hidden');
  page = 1;
  q = searchForm.searchQuery.value;

  getUl(q, page).then(pictureArray => {
    if (pictureArray.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const allPictures = pictureArray.hits
        .map(
          galleryItem => `<a class= "gallery-link" href="${galleryItem.largeImageURL}"><div class="photo-card">
          <img src="${galleryItem.webformatURL}" alt="${galleryItem.tags}" loading="lazy" />
          <div class="info">
          <p class="info-item">
      <b>Likes</b> ${galleryItem.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${galleryItem.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${galleryItem.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${galleryItem.downloads}
    </p>
          </div>
          </div></a>`
        )
        .join('');
      console.log(pictureArray);
      bodyOdy.insertAdjacentHTML('beforeend', allPictures);
      lightbox = new SimpleLightbox('a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();
      if (pictureArray.totalHits > 40) {
        loading.classList.remove('is-hidden');
      }
    }
  });
}

searchForm.addEventListener('submit', galeryCreator);
loading.addEventListener('click', loadMorePics);
