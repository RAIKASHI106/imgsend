import {
  SlashCommand,
  SlashCommandParser,
  SlashCommandArgument,
  ARGUMENT_TYPE,
} from "../../../extensions.js";

// The name of the extension (it should match your folder name)
const extensionName = "simple-extension";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Register a simple command
function registerSimpleCommand() {
  SlashCommandParser.addCommandObject(
    SlashCommand.fromProps({
      name: "hello",
      callback: (namedArgs, unnamedArgs) => {
        return "Hello, world! This is a simple test command.";
      },
      returns: "returns a simple greeting message",
      unnamedArgumentList: [
        SlashCommandArgument.fromProps({
          description: "A placeholder argument (not required)",
          typeList: ARGUMENT_TYPE.STRING,
          isRequired: false,
        }),
      ],
      helpString: `
        <div>
          A simple test command that returns a greeting message.
        </div>
        <div>
          <strong>Example:</strong>
          <pre><code class="language-stscript">/hello</code></pre>
        </div>
      `,
    })
  );
}

// Initialize the extension and register the command
jQuery(async () => {
  try {
    registerSimpleCommand();
    console.log("[Simple Extension] 'hello' command registered successfully.");
  } catch (error) {
    console.error("[Simple Extension] Error registering command:", error);
  }
});
