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

