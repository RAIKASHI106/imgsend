import { sendSystemMessage } from '../../../../script.js';
import { registerSlashCommand } from '../../../slash-commands.js';

registerSlashCommand(
    'rule34img',
    (args, value) => {
        const tags = value.trim().split(/\s+/).join('+');

        // CORS proxy and Rule34 API URL
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=1&json=1`;

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
                if (data.length > 0) {
                    const imageUrl = data[0].file_url; // Extract the image file URL
                    sendSystemMessage('generic', `Here is your image: ${imageUrl}`); // Send the image URL in the message
                } else {
                    sendSystemMessage('generic', 'No results found for that tag.');
                }
            })
            .catch(error => {
                console.error('Error fetching from Rule34 API:', error);
                sendSystemMessage('generic', 'There was an error fetching the image.');
            });

        return `🔍 Searching Rule34 for tags: ${tags}`;
    },
    [],
    'Search Rule34 for a specific tag and fetch an image. Example: /rule34img hyuuga_hinata bikini',
    true,
    true
);
