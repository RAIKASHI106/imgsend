import { extension_settings, registerSlashCommand } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "danbooru-autotagger";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// Load settings
async function loadSettings() {
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  $("#example_setting")
    .prop("checked", extension_settings[extensionName].example_setting)
    .trigger("input");
}

// Settings toggle logic
function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].example_setting = value;
  saveSettingsDebounced();
}

// Simple test button
function onButtonClick() {
  toastr.info("Danbooru Autotagger is active!");
}

// Handle /danbooru command
function handleDanbooruCommand(args) {
  if (args.length === 0) {
    toastr.warning("Please provide at least one tag.");
    return;
  }
  const tags = args.join("+");
  const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tags)}`;
  window.open(url, "_blank");
}

// Register slash command (new API method)
function registerCommands() {
  registerSlashCommand("danbooru", {
    description: "Search Danbooru with tags (e.g. /danbooru bikini hinata)",
    parameters: ["tag1", "tag2", "..."],
    handler: handleDanbooruCommand,
  });
}

// Init
jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
  $("#extensions_settings2").append(settingsHtml);

  $("#my_button").on("click", onButtonClick);
  $("#example_setting").on("input", onExampleInput);

  await loadSettings();
  registerCommands();
});
