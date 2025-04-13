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
    'danimg',
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

            let imageUrl = data[0]?.file_url;
            if (!imageUrl) {
                return `⚠️ No image URL available for that post.`;
            }

            // Make sure image URL is absolute
            if (imageUrl.startsWith('//')) {
                imageUrl = `https:${imageUrl}`;
            } else if (!imageUrl.startsWith('http')) {
                imageUrl = `https://danbooru.donmai.us${imageUrl}`;
            }

            // HTML image with fallback link
            sendSystemMessage(
                'generic',
                `Here is your image for "<strong>${tags}</strong>":<br>
                <a href="${imageUrl}" target="_blank">
                    <img src="${imageUrl}" style="max-width:100%; border-radius:8px" onerror="this.onerror=null; this.src=''; this.outerHTML='⚠️ Could not load image. <a href=${imageUrl} target=_blank>Click here to open</a>';">
                </a>`
            );

            return `✅ Sent top Danbooru image for: ${tags}`;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    },
    [],
    'Gets the top Danbooru image result and sends it in chat. Example: /danimg hinata bikini',
    true,
    true
);
