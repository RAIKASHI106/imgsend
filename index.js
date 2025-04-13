import { sendSystemMessage } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { registerSlashCommand } from '../../../slash-commands.js';
import { isTrueBoolean } from '../../../utils.js';
import { addMessage } from '../../../../script.js';


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
    'getimg',
    async (args, value) => {
        const tags = value.trim().split(/\s+/).join('+');
        const apiUrl = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(tags)}&limit=1&sort=score`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        let imageUrl = data[0].file_url;

        if (imageUrl.startsWith('//')) {
            imageUrl = `https:${imageUrl}`;
        } else if (!imageUrl.startsWith('http')) {
            imageUrl = `https://danbooru.donmai.us${imageUrl}`;
        }

        const preview = `<div>Here is your image for <strong>${tags}</strong>:<br><img src="${imageUrl}" style="max-width:300px; border-radius:8px;"/></div>`;
        addMessage('user', preview); // You can also use 'char', 'bot', or 'system'

        return;
    },
    [],
    'Gets the top Danbooru image result and sends it in chat. Example: /danimg hinata bikini',
    true,
    true
);
