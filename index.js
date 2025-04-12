import {
  extension_settings,
  SlashCommand,
  SlashCommandParser,
  SlashCommandArgument,
  ARGUMENT_TYPE,
} from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "danbooru-autotagger";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// Init settings
async function loadSettings() {
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  $("#example_setting")
    .prop("checked", extension_settings[extensionName].example_setting)
    .trigger("input");
}

function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].example_setting = value;
  saveSettingsDebounced();
}

function onButtonClick() {
  toastr.info("Danbooru Autotagger is active!");
}

// Register /danbooru slash command
function registerDanbooruCommand() {
  SlashCommandParser.addCommandObject(
    SlashCommand.fromProps({
      name: "danbooru",
      callback: (namedArgs, unnamedArgs) => {
        if (!unnamedArgs.length) {
          return "Please provide at least one tag.";
        }

        const tags = unnamedArgs.map(tag => tag.toLowerCase()).join("+");
        const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tags)}`;
        window.open(url, "_blank");
        return `Opened Danbooru with tags: ${tags}`;
      },
      returns: "opens a Danbooru search with the given tags",
      unnamedArgumentList: [
        SlashCommandArgument.fromProps({
          description: "Tags to search (e.g. bikini hinata)",
          typeList: ARGUMENT_TYPE.STRING,
          isRequired: true,
        }),
      ],
      helpString: `
        <div>
          Opens Danbooru in a new tab with the provided tags.
        </div>
        <div>
          <strong>Example:</strong>
          <pre><code class="language-stscript">/danbooru bikini hyuuga_hinata</code></pre>
        </div>
      `,
    })
  );
}

// Init extension
jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
  $("#extensions_settings2").append(settingsHtml);

  $("#my_button").on("click", onButtonClick);
  $("#example_setting").on("input", onExampleInput);

  await loadSettings();
  registerDanbooruCommand();
});
