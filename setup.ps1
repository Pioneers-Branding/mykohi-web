$API_URL = "https://api.opusmax.pro"

Write-Host ""
Write-Host "=========================================="
Write-Host "         * OpusMax Setup                 "
Write-Host "=========================================="
Write-Host ""

$API_KEY = Read-Host -Prompt "  Enter your OpusMax API key"

if ([string]::IsNullOrWhiteSpace($API_KEY)) {
    Write-Host "  [X] API key cannot be empty." -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "  [1/3] Checking Node.js... " -NoNewline
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node -v
    Write-Host "[OK] $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[X] Not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "  [2/3] Configuring Claude Code... " -NoNewline
$CLAUDE_DIR = Join-Path $HOME ".claude"
if (!(Test-Path -Path $CLAUDE_DIR)) {
    New-Item -ItemType Directory -Path $CLAUDE_DIR | Out-Null
}

$settingsPath = Join-Path $CLAUDE_DIR "settings.json"
$settings = @{}

if (Test-Path -Path $settingsPath) {
    try {
        $content = Get-Content -Path $settingsPath -Raw
        $settings = $content | ConvertFrom-Json -AsHashtable
    } catch {
        $settings = @{}
    }
}

if (-not $settings.ContainsKey("env")) {
    $settings["env"] = @{}
}

$settings["env"]["ANTHROPIC_AUTH_TOKEN"] = $API_KEY
$settings["env"]["ANTHROPIC_BASE_URL"] = $API_URL
$settings["env"]["ANTHROPIC_MODEL"] = "Opus 4.8[1m]"
$settings["env"]["ANTHROPIC_SMALL_FAST_MODEL"] = "Haiku 4.5"
$settings["env"]["ANTHROPIC_DEFAULT_SONNET_MODEL"] = "Sonnet 4.6"
$settings["env"]["ANTHROPIC_DEFAULT_OPUS_MODEL"] = "Opus 4.8[1m]"
$settings["env"]["ANTHROPIC_DEFAULT_HAIKU_MODEL"] = "Haiku 4.5"
$settings["env"]["CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC"] = "1"
$settings["hasCompletedOnboarding"] = $true

$settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath
Write-Host "[OK]" -ForegroundColor Green

Write-Host ""
Write-Host "  Verifying connection... " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$API_URL/v1/models" -Headers @{ "x-api-key" = $API_KEY } -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Connected" -ForegroundColor Green
    } else {
        Write-Host "[!] HTTP $($response.StatusCode) (config saved - check key later)" -ForegroundColor Yellow
    }
} catch {
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "[!] HTTP $statusCode (config saved - check key later)" -ForegroundColor Yellow
    } else {
        Write-Host "[!] Connection failed (config saved - check key later)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  [OK] Setup complete!                    "
Write-Host "  Restart Claude Code to apply.           "
Write-Host "=========================================="
Write-Host ""
