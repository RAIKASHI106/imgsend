import { sendSystemMessage } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { registerSlashCommand } from '../../../slash-commands.js';
import { isTrueBoolean } from '../../../utils.js';

registerSlashCommand(
    'rule34img',
    async (args, value) => {
        const tags = value.trim().split(/\s+/).join('+');
        const apiUrl = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=1&json=1`;

        try {
            const response = await fetch(apiUrl);
            const posts = await response.json();

            if (posts.length === 0) {
                sendSystemMessage('generic', `❌ No images found for tags: ${tags}`);
                return `No results for tags: ${tags}`;
            }

            const post = posts[0];
            const imageUrl = post.file_url; // ✅ Use file_url directly

            sendSystemMessage('generic', `🖼️ Here is your image: ${imageUrl}`);
            return `✅ Found image for tags: ${tags}`;
        } catch (error) {
            console.error('Error fetching from Rule34 API:', error);
            sendSystemMessage('generic', `❌ Failed to fetch image.`);
            return `Error while fetching image.`;
        }
    },
    [],
    'Fetch a Rule34.xxx image using tags. Example: /rule34img hinata_hyuuga swimsuit',
    true,
    true
);
