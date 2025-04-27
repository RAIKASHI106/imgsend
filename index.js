// CORS proxy and Rule34 API URL
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=hyuuga_hinata&limit=1&json=1';

// Combine the proxy URL and API URL
const requestUrl = proxyUrl + apiUrl;

// Fetch data from the API
fetch(requestUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Convert response to JSON
    })
    .then(data => {
        console.log('Fetched data:', data);
        if (data.length > 0) {
            const imageUrl = data[0].file_url; // Extract the image file URL
            console.log('Image URL:', imageUrl);
        } else {
            console.log('No results found');
        }
    })
    .catch(error => {
        console.error('Error fetching from Rule34 API:', error);
    });
