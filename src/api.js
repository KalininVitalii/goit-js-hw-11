export const fetchImages = async (inputValue, pageNr) => {
  const API_KEY = '29924264-5d5e566662b34a1c46cf6af93';
  const URL = 'https://pixabay.com/api/';
  return await fetch(`${URL}?key=${API_KEY}&q=${inputValue}&${pageNr}`)
    .then(async response => {
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(response.status);
      }
      return await response.json();
    })
    .catch(error => {
      console.error(error);
    });
};
