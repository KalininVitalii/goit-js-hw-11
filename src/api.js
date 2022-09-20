import axios from 'axios';

const API_KEY = '29924264-5d5e566662b34a1c46cf6af93';
const BASE_URL = 'https://pixabay.com/api';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    if (this.page === undefined) {
      return;
    }
  }

  fetchImages() {
    const url = `${BASE_URL}?key=${API_KEY}`;

    return axios
      .get(url, {
        params: {
          q: `${this.searchQuery}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: `${this.page}`,
          per_page: 40,
        },
      })
      .then(({ data }) => {
        this.incrementPage();
        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
