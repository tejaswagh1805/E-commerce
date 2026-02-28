# 🔧 Fix Git Remote Issue

## Problem:
Your repository is pointing to the wrong remote URL (tejasw-xts/mern_stack_project.git)
It should point to: tejaswagh1805/E-commerce.git

## Solution:

Run these commands in Git Bash:

```bash
# Remove the wrong remote
git remote remove origin

# Add the correct remote
git remote add origin https://github.com/tejaswagh1805/E-commerce.git

# Verify it's correct
git remote -v

# Push to the correct repository
git push -u origin main
```

## If you still get 403 error:

Use Personal Access Token:

```bash
# Push with token in URL (replace YOUR_TOKEN with actual token)
git push https://YOUR_TOKEN@github.com/tejaswagh1805/E-commerce.git main
```

## Get Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "E-commerce Push"
4. Select: ✅ repo (all)
5. Generate and copy token
6. Use in command above

---

**After fixing, your code will push successfully!** 🚀
