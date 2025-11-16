<#
 Reliable dev starter for FocoTotal (Windows PowerShell)
 - Kills old Node processes
 - Starts back-end (absolute path) and waits for port 3000
 - Starts front-end on port 5173
#>

$ErrorActionPreference = "Stop"

Write-Host "Stopping any running Node processes..."
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$back = "C:\Users\Usuario\OneDrive\Desktop\AgileTask\FocoTotal\back-end\src\server.js"
$frontDir = "C:\Users\Usuario\OneDrive\Desktop\AgileTask\FocoTotal\front-end"

Write-Host "Starting back-end (PORT 3000 with retry)..."
Start-Job -ScriptBlock {
  node $using:back
} | Out-Null

# Wait for port 3000 to respond (max 30s)
$timeout = [Diagnostics.Stopwatch]::StartNew()
$ready = $false
while (-not $ready -and $timeout.Elapsed.TotalSeconds -lt 30) {
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2
    if ($resp.StatusCode -eq 200) { $ready = $true; break }
  } catch {
    # ignore until ready
  }
  Start-Sleep -Milliseconds 500
}

if (-not $ready) {
  Write-Warning "Back-end did not respond on /health within timeout."
} else {
  Write-Host "Back-end running: http://localhost:3000/health"
}

Write-Host "Starting front-end (Vite @ 5173)..."
Start-Job -ScriptBlock {
  npm --prefix $using:frontDir run dev -- --port 5173
} | Out-Null

Start-Sleep -Seconds 1

$links = @"
Links:
  Front-end: http://localhost:5173/
  API:       http://localhost:3000/
  Health:    http://localhost:3000/health
"@
Write-Host $links
