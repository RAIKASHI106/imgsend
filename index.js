import { sendSystemMessage } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { registerSlashCommand } from '../../../slash-commands.js';
import { isTrueBoolean } from '../../../utils.js';


registerSlashCommand(
    'danimg',
    (args, value) => {
        const tags = value.trim().split(/\s+/).join(' ');
        const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tags)}`;
        sendSystemMessage('generic', ` Here is your image.....`);
        window.open(url, '_blank');
        return `🔍 Opened Danbooru with tags: ${tags}`;
    },
    [],
    'Open Danbooru with tags. Example: /ctx-help hinata bikini',
    true,
    true
);



registerSlashCommand(
    'imgdan',
    async (args, value) => {
        const tags = value.trim().split(/\s+/).join('+');
        const apiUrl = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(tags)}&limit=1&sort=score`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                return `❌ Danbooru API request failed: ${response.status}`;
            }

            const data = await response.json();
            if (!data || data.length === 0) {
                return `⚠️ No images found for tags: ${tags}`;
            }

            const imageUrl = data[0]?.file_url;
            if (!imageUrl) {
                return `⚠️ Image found, but no file_url available.`;
            }

            sendSystemMessage('generic', `Here is your image for "${tags}": <br><img src="${imageUrl}" style="max-width:100%">`);
            return `✅ Sent image from Danbooru for tags: ${tags}`;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    },
    [],
    'Gets the top Danbooru image result and sends it in chat. Example: /danimg hinata bikini',
    true,
    true
);
