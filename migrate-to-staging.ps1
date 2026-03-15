# ============================================================
# migrate-to-staging.ps1
# Migrates apps/web and apps/mobile from Hansonian into the
# support-iq-agents monorepo on branch dev/mann/frontend.
#
# Run from anywhere on your machine:
#   .\migrate-to-staging.ps1 -StagingRepo "C:\path\to\support-iq-agents"
#
# Owner: Priyanka (mannpandya1702)
# Touches ONLY: apps/web/  apps/mobile/
# ============================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$StagingRepo,

    [string]$HansonianRepo = $PSScriptRoot,   # defaults to where this script lives
    [string]$Branch        = "dev/mann/frontend",
    [switch]$DryRun        = $false           # pass -DryRun to preview without copying
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Helpers ──────────────────────────────────────────────────────────────────

function Log-Step   { param([string]$msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Log-OK     { param([string]$msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Log-Warn   { param([string]$msg) Write-Host "    [!!] $msg" -ForegroundColor Yellow }
function Log-Error  { param([string]$msg) Write-Host "    [XX] $msg" -ForegroundColor Red; exit 1 }

function Require-Path {
    param([string]$p, [string]$label)
    if (-not (Test-Path $p)) { Log-Error "$label not found: $p" }
}

function Safe-Copy {
    param([string]$src, [string]$dst)
    if ($DryRun) {
        Write-Host "    [DRY] Would copy: $src  ->  $dst" -ForegroundColor DarkGray
        return
    }
    $dstDir = Split-Path $dst -Parent
    if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
    Copy-Item -Path $src -Destination $dst -Force
}

function Safe-CopyDir {
    param([string]$src, [string]$dst, [string[]]$excludeDirs = @())
    if (-not (Test-Path $src)) { Log-Warn "Source dir missing, skipping: $src"; return }

    Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($src.Length).TrimStart('\','/')

        # Skip excluded directory trees
        foreach ($ex in $excludeDirs) {
            if ($rel.StartsWith($ex, [System.StringComparison]::OrdinalIgnoreCase)) { return }
        }

        $dstFile = Join-Path $dst $rel
        Safe-Copy $_.FullName $dstFile
    }
}

# ── 0. Validate inputs ───────────────────────────────────────────────────────

Log-Step "Validating paths"

$HansonianRepo = (Resolve-Path $HansonianRepo).Path
$StagingRepo   = (Resolve-Path $StagingRepo).Path

Require-Path $HansonianRepo    "Hansonian repo"
Require-Path $StagingRepo      "Staging repo"
Require-Path "$HansonianRepo\apps\web"    "apps/web source"
Require-Path "$HansonianRepo\apps\mobile" "apps/mobile source"

$webSrc    = "$HansonianRepo\apps\web"
$mobileSrc = "$HansonianRepo\apps\mobile"
$webDst    = "$StagingRepo\apps\web"
$mobileDst = "$StagingRepo\apps\mobile"

Log-OK "Hansonian : $HansonianRepo"
Log-OK "Staging   : $StagingRepo"
if ($DryRun) { Log-Warn "DRY RUN — no files will be copied or committed" }

# ── 1. Confirm staging repo branch ──────────────────────────────────────────

Log-Step "Checking staging repo branch"

Push-Location $StagingRepo

$currentBranch = git rev-parse --abbrev-ref HEAD 2>&1
if ($LASTEXITCODE -ne 0) { Log-Error "Not a git repo: $StagingRepo" }

if ($currentBranch -ne $Branch) {
    Log-Warn "Currently on '$currentBranch'. Switching to '$Branch'..."
    git fetch origin $Branch 2>&1 | Out-Null
    git checkout $Branch 2>&1
    if ($LASTEXITCODE -ne 0) { Log-Error "Could not checkout branch: $Branch" }
}

Log-OK "On branch: $Branch"

# Check for uncommitted changes in staging
$stagingStatus = git status --porcelain 2>&1
if ($stagingStatus) {
    Log-Warn "Staging repo has uncommitted changes:"
    $stagingStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor Yellow }
    $ans = Read-Host "    Continue anyway? (y/N)"
    if ($ans -notmatch '^[Yy]$') { Pop-Location; exit 0 }
}

Pop-Location

# ── 2. Show what will change (diff summary) ──────────────────────────────────

Log-Step "Pre-migration diff summary (staging vs source)"

$webFiles = @(
    "package.json", "package-lock.json", "next.config.js",
    "tailwind.config.js", "tsconfig.json", "postcss.config.mjs",
    "eslint.config.mjs", "components.json", "Dockerfile"
)

foreach ($f in $webFiles) {
    $s = "$webSrc\$f"
    $d = "$webDst\$f"
    if ((Test-Path $s) -and (Test-Path $d)) {
        $diff = Compare-Object (Get-Content $s) (Get-Content $d) -ErrorAction SilentlyContinue
        if ($diff) {
            Log-Warn "DIFFERS: apps/web/$f  (your source wins — review if staging had intentional changes)"
        } else {
            Log-OK   "SAME   : apps/web/$f"
        }
    } elseif (Test-Path $s) {
        Log-Warn "NEW    : apps/web/$f  (does not exist in staging yet)"
    }
}

$mobileMeta = @("pubspec.yaml", "analysis_options.yaml")
foreach ($f in $mobileMeta) {
    $s = "$mobileSrc\$f"
    $d = "$mobileDst\$f"
    if ((Test-Path $s) -and (Test-Path $d)) {
        $diff = Compare-Object (Get-Content $s) (Get-Content $d) -ErrorAction SilentlyContinue
        if ($diff) {
            Log-Warn "DIFFERS: apps/mobile/$f"
        } else {
            Log-OK   "SAME   : apps/mobile/$f"
        }
    } elseif (Test-Path $s) {
        Log-Warn "NEW    : apps/mobile/$f"
    }
}

if (-not $DryRun) {
    $ans = Read-Host "`n    Proceed with copy? (y/N)"
    if ($ans -notmatch '^[Yy]$') { exit 0 }
}

# ── 3. Migrate apps/web ───────────────────────────────────────────────────────

Log-Step "Migrating apps/web"

# 3a. Root config files
$webRootFiles = @(
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "components.json",
    "Dockerfile"
    # NOTE: vercel.json intentionally excluded — staging uses Docker, not Vercel
)

foreach ($f in $webRootFiles) {
    $src = "$webSrc\$f"
    if (Test-Path $src) {
        Safe-Copy $src "$webDst\$f"
        Log-OK "web/$f"
    } else {
        Log-Warn "web/$f not found in source — skipped"
    }
}

# 3b. app/ routes (all route groups + globals)
$appExclude = @(
    ".next",
    "node_modules"
)
Safe-CopyDir "$webSrc\app" "$webDst\app" $appExclude
Log-OK "web/app/ (all routes)"

# 3c. shared/components
Safe-CopyDir "$webSrc\shared" "$webDst\shared"
Log-OK "web/shared/components/"

# 3d. lib/
Safe-CopyDir "$webSrc\lib" "$webDst\lib"
Log-OK "web/lib/"

# 3e. .env.example — only if staging does not already have any .env* file
$hasEnv = Get-ChildItem -Path $webDst -Filter ".env*" -ErrorAction SilentlyContinue
$envEx  = "$webSrc\.env.example"
if (-not $hasEnv -and (Test-Path $envEx)) {
    Safe-Copy $envEx "$webDst\.env.example"
    Log-OK "web/.env.example (no existing .env in staging)"
} else {
    Log-OK "web/.env — staging already has one or no .env.example exists, skipped"
}

# ── 4. Migrate apps/mobile ───────────────────────────────────────────────────

Log-Step "Migrating apps/mobile"

# 4a. Root files
$mobileRootFiles = @("pubspec.yaml", "analysis_options.yaml")
foreach ($f in $mobileRootFiles) {
    $src = "$mobileSrc\$f"
    if (Test-Path $src) {
        Safe-Copy $src "$mobileDst\$f"
        Log-OK "mobile/$f"
    }
}

# 4b. pubspec.lock — only if staging does not already have one
$stagingLock = "$mobileDst\pubspec.lock"
$sourceLock  = "$mobileSrc\pubspec.lock"
if (-not (Test-Path $stagingLock) -and (Test-Path $sourceLock)) {
    Safe-Copy $sourceLock $stagingLock
    Log-OK "mobile/pubspec.lock (staging had none)"
} elseif (Test-Path $stagingLock) {
    Log-Warn "mobile/pubspec.lock already exists in staging — NOT overwriting. Run 'flutter pub get' after migration."
} else {
    Log-Warn "mobile/pubspec.lock not found in source — run 'flutter pub get' in apps/mobile after migration"
}

# 4c. lib/ — all Dart source files
$mobileExclude = @(
    "build",
    ".dart_tool"
)
Safe-CopyDir "$mobileSrc\lib" "$mobileDst\lib" $mobileExclude
Log-OK "mobile/lib/ (all Dart sources)"

# 4d. android/ platform folder
Safe-CopyDir "$mobileSrc\android" "$mobileDst\android" @("build", ".gradle")
Log-OK "mobile/android/"

# 4e. ios/ platform folder
Safe-CopyDir "$mobileSrc\ios" "$mobileDst\ios" @("build", "Pods", ".symlinks")
Log-OK "mobile/ios/"

# 4f. test/
Safe-CopyDir "$mobileSrc\test" "$mobileDst\test"
Log-OK "mobile/test/"

# ── 5. Verify critical files exist in destination ────────────────────────────

Log-Step "Verifying critical files in staging destination"

$mustExistWeb = @(
    "apps\web\package.json",
    "apps\web\next.config.js",
    "apps\web\tailwind.config.js",
    "apps\web\Dockerfile",
    "apps\web\app\(auth)\page.tsx",
    "apps\web\app\(ceo)\admin\page.tsx",
    "apps\web\app\(employee)\employee\page.tsx",
    "apps\web\app\(employee)\employee\hil-queue\page.tsx",
    "apps\web\app\(family)\family\page.tsx",
    "apps\web\app\globals.css",
    "apps\web\lib\firebase.ts",
    "apps\web\shared\components\index.ts"
)

$mustExistMobile = @(
    "apps\mobile\pubspec.yaml",
    "apps\mobile\lib\main.dart",
    "apps\mobile\lib\features\auth\login_screen.dart",
    "apps\mobile\lib\features\shifts\shifts_screen.dart",
    "apps\mobile\lib\features\notes\notes_screen.dart",
    "apps\mobile\lib\features\incidents\incidents_screen.dart",
    "apps\mobile\lib\features\incidents\voice_record_widget.dart",
    "apps\mobile\lib\services\offline_queue.dart"
)

$verifyFail = $false
foreach ($f in ($mustExistWeb + $mustExistMobile)) {
    $full = "$StagingRepo\$f"
    if (Test-Path $full) {
        Log-OK $f
    } else {
        Log-Warn "MISSING: $f"
        $verifyFail = $true
    }
}

if ($verifyFail -and -not $DryRun) {
    Log-Error "One or more critical files are missing. Do NOT commit until resolved."
}

# ── 6. Commit and push ───────────────────────────────────────────────────────

if (-not $DryRun) {
    Log-Step "Staging git commit"

    Push-Location $StagingRepo

    git add apps/web apps/mobile 2>&1

    $staged = git diff --cached --name-only 2>&1
    if (-not $staged) {
        Log-OK "Nothing new to commit — staging was already up to date."
        Pop-Location
    } else {
        Write-Host "`n    Files staged for commit:" -ForegroundColor Cyan
        $staged | ForEach-Object { Write-Host "      $_" }

        $ans = Read-Host "`n    Commit and push? (y/N)"
        if ($ans -notmatch '^[Yy]$') {
            Log-Warn "Skipped commit. Files are staged — run 'git commit' manually when ready."
            Pop-Location
        } else {
            $msg = @"
feat(frontend): migrate apps/web and apps/mobile from Hansonian

Web (Next.js 16 / React 19):
- Unified multi-role portal: CEO/Admin, Employee, Family
- Auth via Firebase with demo-mode fallback
- Employee portal: rostering, compliance, DEX audit, HIL queue, staff
- CEO portal: dashboard, DEX, alerts, non-compliant view
- Family portal: participant dashboard
- Shared component library (ActionButton, AlertBanner, DataCard, etc.)
- Dockerfile for standalone Docker image (CI/CD ready)

Mobile (Flutter 3 / Dart 3):
- Caregiver login screen with demo credentials
- Shift clock-in/out with GPS (M2-S08)
- Notes screen with participant context
- Incident reporting with photo + voice record widget (M3-S13)
- Offline shift queue service with reconnect sync (M2-S08)
"@
            git commit -m $msg 2>&1
            if ($LASTEXITCODE -ne 0) { Log-Error "git commit failed" }

            Log-Step "Pushing to origin/$Branch"
            $retries = 0
            $delays  = @(2, 4, 8, 16)
            $pushed  = $false

            while (-not $pushed -and $retries -le $delays.Length) {
                git push -u origin $Branch 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $pushed = $true
                } elseif ($retries -lt $delays.Length) {
                    $wait = $delays[$retries]
                    Log-Warn "Push failed, retrying in ${wait}s... (attempt $($retries+1)/4)"
                    Start-Sleep -Seconds $wait
                    $retries++
                } else {
                    Log-Error "Push failed after 4 retries. Check your network / GitHub auth."
                }
            }

            Log-OK "Pushed to origin/$Branch"
            Pop-Location
        }
    }
}

# ── 7. Post-migration validation instructions ─────────────────────────────────

Log-Step "Post-migration validation steps to run manually"

Write-Host @"

  WEB — run inside $StagingRepo\apps\web:
    npm install
    npx tsc --noEmit
    npm run build
    # Build output should list all these routes:
    #   /             (auth login)
    #   /register
    #   /admin        /admin/dex  /admin/alerts  /admin/non-compliant
    #   /employee     /employee/rostering  /employee/compliance
    #                 /employee/dex-audit  /employee/hil-queue  /employee/staff
    #   /family

  MOBILE — run inside $StagingRepo\apps\mobile:
    flutter pub get
    flutter analyze
    # Expected: No issues found

"@ -ForegroundColor White

Log-OK "Migration complete."
