import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
refs.btnLoadMore.style.display = 'none';
refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', fetchImages);

const newsApiService = new NewsApiService();

function onSearch(event) {
  event.preventDefault();
  newsApiService.query = event.currentTarget.elements.searchQuery.value;

  if (newsApiService.query === '') {
    return Notify.failure('Sorry, enter a valid query. Please try again.');
  }
  gallerySimpleLightbox.refresh();
  newsApiService.resetPage();
  clearGallery();
  fetchImages();
}

function fetchImages() {
  newsApiService
    .fetchImages()
    .then(data => {
      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (data.totalHits > 0) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderImageList(data.hits);
        // gallerySimpleLightbox.refresh();
        refs.btnLoadMore.style.display = 'block';
      }

      if (data.totalHits % this.page < 40) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.btnLoadMore.style.display = 'none';
      }

      // renderImageList(data.hits);
    })
    .catch(onFetchError);
}

function onFetchError(error) {
  Notify.failure(error.message);
}

function renderImageList(images) {
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-card ">
       <a href="${image.largeImageURL}"><img  src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" class="photo-img"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b><br> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b><br> ${image.views}</span>
            </p>
            <p class="info-item">
                <b>Comments</b><br> ${image.comments}</span>
            </p>
            <p class="info-item">
                <b>Downloads</b><br> ${image.downloads}</span>
            </p>
        </div>
    </div>`;
    })
    .join('');
  refs.gallery.innerHTML += markup;
}

function clearGallery() {
  refs.gallery.innerHTML = '';
  refs.btnLoadMore.style.display = 'none';
}
