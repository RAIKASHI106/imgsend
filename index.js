import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "danbooru-autotagger";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// Settings init
async function loadSettings() {
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }
}

// Command logic
function handleDanbooruCommand(args) {
  const tags = args.join("+");
  const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tags)}`;
  window.open(url, "_blank");
}

// Register the slash command
function registerCommands() {
  if (window.SillyTavern && window.SillyTavern.Commands) {
    SillyTavern.Commands.register("danbooru", {
      description: "Search Danbooru with tags",
      usage: "/danbooru tag1 tag2",
      run: (args) => handleDanbooruCommand(args),
    });
  }
}

// Extension entry point
jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
  $("#extensions_settings2").append(settingsHtml);

  $("#my_button").on("click", onButtonClick);
  $("#example_setting").on("input", onExampleInput);

  loadSettings();
  registerCommands();
});

// Optional button logic from template
function onButtonClick() {
  toastr.info("Danbooru Autotagger is active!");
}

function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].example_setting = value;
  saveSettingsDebounced();
}
