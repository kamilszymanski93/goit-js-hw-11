import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const apiKey = '36761920-b8cd00c3e5cd5e24a54e621cb';
const apiStart = 'https://pixabay.com/api/';
const searchForm = document.querySelector('.search-form');
const bodyOdy = document.querySelector('body');

const getUrl = async userRequest => {
  const baseUrl = `${apiStart}?key=${apiKey}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await fetch(baseUrl);
  const pictureArray = await response.json();
  const picArray = pictureArray.hits;
  return picArray;
};

function galeryCreator(e) {
  e.preventDefault();
  getUrl(searchForm.searchQuery.value).then(picArray => {
    const allPictures = picArray
      .map(
        galleryItem => `<li><a class="gallery__item" href="${galleryItem.largeImageURL}">
    <img class = "gallery__image" src="${galleryItem.webformatURL}" alt="${galleryItem.tags}"/></a></li>`
      )
      .join('');
    bodyOdy.insertAdjacentHTML('beforeend', allPictures);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  });
}
searchForm.addEventListener('submit', galeryCreator);

console.log(':)');
