#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ISSUE_DIR="${ISSUE_DIR:-${REPO_ROOT}/upgrade-issues}"
PROJECT_ID="${UPGRADE_PROJECT_ID:-}"
REPO_SLUG="${GITHUB_REPO:-}"
LABELS="${UPGRADE_ISSUE_LABELS:-upgrade}"
DRY_RUN=0

usage() {
  cat <<'USAGE'
Usage: create-upgrade-project-items.sh [--dry-run]

Environment variables:
  UPGRADE_PROJECT_ID   GraphQL node ID of the GitHub Project (Projects v2) to receive the issues.
                       Obtain via `gh project view <number> --owner <org_or_user> --format json --jq '.id'`.
  GITHUB_REPO          owner/repo slug (defaults to the current git remote origin).
  ISSUE_DIR            Directory containing markdown files (default: upgrade-issues).
  UPGRADE_ISSUE_LABELS Comma-separated labels to apply (default: "upgrade").

Flags:
  --dry-run            Print the actions without calling GitHub.

Prerequisites: authenticated GitHub CLI (`gh`) with access to the repository and project.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! -d "$ISSUE_DIR" ]]; then
  echo "Issue directory not found: $ISSUE_DIR" >&2
  exit 1
fi

if [[ -z "$REPO_SLUG" ]]; then
  if git -C "$REPO_ROOT" remote get-url origin &>/dev/null; then
    ORIGIN_URL="$(git -C "$REPO_ROOT" remote get-url origin)"
    REPO_SLUG="${ORIGIN_URL#*:}"
    REPO_SLUG="${REPO_SLUG#https://github.com/}"
    REPO_SLUG="${REPO_SLUG%.git}"
  fi
fi

if [[ -z "$REPO_SLUG" ]]; then
  echo "Unable to determine GITHUB_REPO. Set it explicitly." >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required." >&2
  exit 1
fi

if [[ -z "$PROJECT_ID" ]]; then
  echo "Set UPGRADE_PROJECT_ID to the GraphQL node ID of the target GitHub Project." >&2
  exit 1
fi

IFS=',' read -r -a LABEL_ARRAY <<< "$LABELS"
if [[ ${#LABEL_ARRAY[@]} -eq 1 && -z "${LABEL_ARRAY[0]}" ]]; then
  LABEL_ARRAY=()
fi

add_to_project() {
  local issue_id="$1"
  local issue_url="$2"
  if (( DRY_RUN )); then
    echo "[dry-run] Would add $issue_url to project $PROJECT_ID"
    return
  fi
  if ! gh api graphql -f query='mutation($project:ID!,$content:ID!){addProjectV2ItemById(input:{projectId:$project,contentId:$content}){item{id}}}' -F project="$PROJECT_ID" -F content="$issue_id" >/dev/null 2>&1; then
    echo "Warning: unable to add $issue_url to project $PROJECT_ID" >&2
  else
    echo "Added $issue_url to project"
  fi
}

create_or_link_issue() {
  local title="$1"
  local body_file="$2"
  local issue_url
  local issue_id
  if (( DRY_RUN )); then
    echo "[dry-run] Would ensure issue '$title' exists using $body_file"
    return
  fi
  issue_id=$(gh issue list --repo "$REPO_SLUG" --state all --search "\"$title\" in:title" --json id --jq '.[0].id' --limit 1)
  if [[ -n "$issue_id" && "$issue_id" != "null" ]]; then
    issue_url=$(gh issue list --repo "$REPO_SLUG" --state all --search "\"$title\" in:title" --json url --jq '.[0].url' --limit 1)
    echo "Found existing issue for '$title': $issue_url"
  else
    local label_flags=""
    if ((${#LABEL_ARRAY[@]})); then
      printf -v label_flags ' --label %q' "${LABEL_ARRAY[@]}"
    fi
    local issue_json
    issue_json=$(gh issue create --repo "$REPO_SLUG" --title "$title" --body-file "$body_file" ${label_flags} --json id,url)
    issue_id=$(ISSUE_JSON="$issue_json" python3 - <<'PY'
import json, os
print(json.loads(os.environ['ISSUE_JSON']).get('id',''))
PY
)
    issue_url=$(ISSUE_JSON="$issue_json" python3 - <<'PY'
import json, os
print(json.loads(os.environ['ISSUE_JSON']).get('url',''))
PY
)
    echo "Created issue $issue_url"
  fi
  add_to_project "$issue_id" "$issue_url"
}

for file in "$ISSUE_DIR"/*.md; do
  [[ -e "$file" ]] || continue
  title=$(sed -n '1{s/^# //;p}' "$file")
  if [[ -z "$title" ]]; then
    echo "Skipping $file (missing '# Title' line)" >&2
    continue
  fi
  echo "Processing: $title"
  create_or_link_issue "$title" "$file"
done
