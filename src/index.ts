import { isTitleAllowed, parseAllowedPrefixes } from "./lib.js";

import * as core from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
    try {
        const rawPrefixes = core.getInput("allowed-prefixes", { required: true });
        const allowedPrefixes = parseAllowedPrefixes(rawPrefixes);
        const githubToken = core.getInput("github-token");

        if (allowedPrefixes.length === 0) {
            core.setFailed("Input 'allowed-prefixes' must contain at least one prefix.");
            return;
        }

        const pr = github.context.payload.pull_request;
        let title = pr?.title;

        if (!title && githubToken) {
            const octokit = github.getOctokit(githubToken);
            const pullNumber = pr?.number ?? github.context.issue.number;

            if (!pullNumber) {
                core.setFailed(
                    "No pull request number found. This action must run on pull_request events.",
                );
                return;
            }

            const { owner, repo } = github.context.repo;
            const response = await octokit.rest.pulls.get({
                owner,
                repo,
                pull_number: pullNumber,
            });
            title = response.data.title;
        }

        if (!title) {
            core.setFailed(
                "No pull request title found. This action must run on pull_request events.",
            );
            return;
        }

        const matches = isTitleAllowed(title, allowedPrefixes);

        if (!matches) {
            core.setFailed(
                `PR title "${title}" does not start with an allowed prefix. Allowed prefixes: ${allowedPrefixes.join(
                    ", ",
                )}`,
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
