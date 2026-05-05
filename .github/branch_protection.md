# GitHub Branch Protection Configuration

# Apply this configuration to your main branch

main:

# Require pull request reviews before merging

required_pull_request_reviews:
required_approving_review_count: 1
dismiss_stale_reviews: true
require_code_owner_reviews: true

# Require status checks to pass before merging

required_status_checks:
strict: true
contexts: - "CI / Build, Lint, and Test"

# Require branches to be up to date before merging

require_linear_history: false

# Require code owners to review pull requests

require_code_owner_reviews: true

# Dismiss approved reviews when new commits are pushed

dismiss_stale_reviews: true

# Require branches to be up to date

required_pull_request_reviews:
require_code_owner_reviews: true

# How to apply:

# 1. Go to Settings > Branches

# 2. Click "Add rule" under "Branch protection rules"

# 3. Set "Branch name pattern" to "main"

# 4. Enable:

# - Require pull request reviews before merging

# - Require status checks to pass before merging

# - Require branches to be up to date before merging

# - Require code owner reviews

# - Dismiss stale pull request approvals when new commits are pushed

# 5. Add status checks:

# - CI / Build, Lint, and Test
