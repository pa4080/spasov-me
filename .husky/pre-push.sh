#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔢 Auto-bumping version before push..."

# Bump patch version (e.g. 2.1.2 → 2.1.3)
pnpm version patch --no-git-tag-version

# Add and commit the version change
git add package.json
git commit -m "chore: bump version [auto]" || echo "ℹ️ No changes to commit"

# Continue pushing
