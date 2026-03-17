# PR Title Prefix Validator

Docker-based GitHub Action that validates pull request titles against a list of
allowed prefixes.

## Inputs

- `allowed-prefixes` (required): Comma or newline separated list of allowed
  title prefixes. Example: `feat,fix,chore` or:
    ```
    feat:
    fix:
    chore:
    ```
- `github-token` (optional): GitHub token used to fetch PR data via the API if
  needed. Defaults to `${{ github.token }}`.

## Example Usage

```yaml
name: PR title lint
on:
    pull_request:
        types: [opened, edited, reopened, synchronize]

jobs:
    title-lint:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
      - uses: ./
        with:
          allowed-prefixes: |
            feat:
            fix:
            chore:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
