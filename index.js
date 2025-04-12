import { sendSystemMessage } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { registerSlashCommand } from '../../../slash-commands.js';
import { isTrueBoolean } from '../../../utils.js';




const showHelp = () => {
    const examples = [
        [
            '/ctx chatId | /echo',
            ' – gets the ID of he active chat',
        ],
        [
            '/ctx characters::5::avatar | /echo',
            ' – gets the avatar filename of the character at index 5 (index starts at 0)',
        ],
        [
            '/ctx characters(find name eq Alice)::avatar | /echo',
            ' – gets the avatar filename of the character named Alice',
        ],
        [
            '/ctx groupId | /ctx groups(find id eq {{pipe}})::members | /echo',
            ' – gets the list of members of the current group (their avatar filenames)',
        ],
        [
            '/ctx groupId | /ctx groups(find id eq {{pipe}})::members::1 | /ctx characters(find avatar eq {{pipe}})::name |/echo',
            ' – gets the name of the second member of the current group (index starts at 0)',
        ],
    ];
    sendSystemMessage('generic', `
        <h3>/ctx</h3>
        <div>
            /ctx gives you access to SillyTavern's application context.
        </div>
        <div>
            Open your browser's dev tools (F12) and type the following to see what data is available.
        </div>
        <div>
            <span class="monospace">SillyTavern.getContext()</span>
        </div>

        <hr>

        <h3>Accessing Values</h3>
        <div>
            Use <span class="monospace">::</span> to access child values (items in a list or dictionary).
        </div>
        <div>
            Example: <span class="monospace">/ctx characters::10::first_mes | /echo</span>
        </div>

        <hr>

        <h3>Filtering Lists</h3>
        <div>
            Lists an be filtered and searched with several functions:
        </div>
        <ul>
            <li><span class="monospace">find</span> - Find one list item by comparing one of its properties against a provided value.</li>
            <li><span class="monospace">findIndex</span> - Find one list item's index (position in the list) by comparing one of its properties against a provided value.</li>
            <li><span class="monospace">filter</span> - Get a list with all matching item's by comparing one of the item's properties against a provided value.</li>
        </ul>
        <div>
            They are all used the same way:
        </div>
        <div>
            <span class="monospace">/ctx characters(find name eq Seraphina) | /echo</span>
        </div>
        <div>
            <span class="monospace">/ctx characters(findIndex name eq Coding Sensei) | /echo</span>
        </div>
        <div>
            <span class="monospace">/ctx characters(filter fav eq true) | /echo</span>
        </div>
        <div>
            Comparison operations for the find and filter functions are as follows:
        </div>
        <ul>
            <li><span class="monospace">eq</span> – property equals value</li>
            <li><span class="monospace">neq</span> – property does not equal value</li>
            <li><span class="monospace">lt</span> – property is less than value</li>
            <li><span class="monospace">lte</span> – property is less than or equals value</li>
            <li><span class="monospace">gt</span> – property is greater than value</li>
            <li><span class="monospace">gte</span> – property is greater than or equals value</li>
            <li><span class="monospace">in</span> – property is included in value (character in text or item in list)</li>
            <li><span class="monospace">nin</span> – property is not included in value</li>
        </ul>

        <h3>Map</h3>
        <div>
            To extract only one property of a dictionary or object you can use map.
        </div>
        <div>
            <span class="monospace">/ctx characters(map name) | /echo</span>
        </div>
        <div>
            Can be combined with filters.
        </div>
        <div>
            <span class="monospace">/ctx characters(filter fav eq true)(map name) | /echo</span>
        </div>

        <hr>

        <h3>Examples</h3>
        ${examples.map(it=>`<div><span class="monospace">${it[0]}</span></div><div>${it[1]}</div>\n`).join('\n')}
    `);
};

registerSlashCommand('ctx-help', () => showHelp(), ['ctx?'], 'get help for the /ctx slash command', true, true);


registerSlashCommand(
    'danimg',
    (args, value) => {
        const tags = value.trim().split(/\s+/).join(' ');
        const response = await fetch(`https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(tags)}&limit=1`);

        sendSystemMessage('generic', ` Here is your image.....`);
        if (!response.ok) {
            return `❌ Failed to fetch image. Status: ${response.status}`;
        }

        const data = await response.json();
        if (!data || data.length === 0 || !data[0].file_url) {
            return `⚠️ No images found for tags: ${tags}`;
        }

        const imageUrl = data[0].file_url;
        window.open(imageUrl, '_blank');
        return `✅ Opened image for tags: ${tags}`;
    },
    [],
    'Open Danbooru with tags. Example: /ctx-help hinata bikini',
    true,
    true
);
