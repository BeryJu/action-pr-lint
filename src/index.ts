import * as core from "@actions/core";
import * as github from "@actions/github";

function parseAllowedPrefixes(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

async function run(): Promise<void> {
  try {
    const rawPrefixes = core.getInput("allowed-prefixes", { required: true });
    const allowedPrefixes = parseAllowedPrefixes(rawPrefixes);

    if (allowedPrefixes.length === 0) {
      core.setFailed("Input 'allowed-prefixes' must contain at least one prefix.");
      return;
    }

    const pr = github.context.payload.pull_request;
    const title = pr?.title;

    if (!title) {
      core.setFailed(
        "No pull request title found. This action must run on pull_request events."
      );
      return;
    }

    const matches = allowedPrefixes.some((prefix) => title.startsWith(prefix));

    if (!matches) {
      core.setFailed(
        `PR title "${title}" does not start with an allowed prefix. Allowed prefixes: ${allowedPrefixes.join(
          ", "
        )}`
      );
      return;
    }

    core.info(`PR title "${title}" matches allowed prefixes.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(message);
  }
}

run();
