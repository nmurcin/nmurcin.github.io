# Deployment and rollback

## Hosting

The production user-site repository remains nmurcin/nmurcin.github.io.
GitHub Pages uses the legacy branch build from main / (root), with no custom domain.
The clean professional URL is https://nmurcin.github.io/.
There is no SPA catch-all or framework router.
.nojekyll makes the plain static output explicit.

The two personal apps are independently hosted project repositories:
- https://nmurcin.github.io/watch-together/ -> nmurcin/watch-together, main /
- https://nmurcin.github.io/blue-origin-landings/ -> nmurcin/blue-origin-landings, main /

No app migrations or code changes are necessary.

## V1 recovery points

All point to original production commit 83280310422c95757c72e008906c70ea10056f3d:
- origin/archive/portfolio-v1
- origin tag portfolio-v1-final-2026-09
- private repository nmurcin/portfolio-v1-archive, main and matching tag

The source PDFs at C:/Documents/Resumes remain untouched.
archive/Portfolio_Nathaniel_Murcin_V1.pdf is an additional byte-identical V1 PDF copy.
See ASSETS.md for SHA-256 records.

## Cutover

Review portfolio-v2 and run the checks in QA.md. Confirm all final downloads exist.
Fetch the current production branch and inspect any changes since the V1 checkpoint.
If main remains at the expected ancestor, merge V2 without rewriting history:

    git switch main
    git merge --no-ff portfolio-v2 -m "Deploy engineering portfolio V2"
    git push origin main

Do not force-push. Confirm the Pages build is successful and check the root, résumé,
portfolio downloads, both app routes, and a missing-page URL after deployment.

## Roll back without losing V2 history

Preferred: revert the V2 deployment merge on main, using its actual commit hash:

    git switch main
    git pull --ff-only origin main
    git revert -m 1 <V2_DEPLOYMENT_MERGE_COMMIT>
    git push origin main

This restores the pre-merge production tree and leaves V2, archive refs, and history intact.
If later production commits exist, inspect the revert carefully before pushing.

To restore the exact V1 tree regardless of later content, first make sure the worktree is clean,
create a rollback branch from the latest main, then restore the tagged tree as a NEW commit:

    git switch -c restore-v1 origin/main
    git restore --source=portfolio-v1-final-2026-09 --staged --worktree -- .
    git diff --cached --stat
    git commit -m "Restore archived portfolio V1"
    git switch main
    git merge --ff-only restore-v1
    git push origin main

The V1 tree is restorable without deleting or rewriting any commits. The two app repositories
remain untouched in either rollback procedure.
