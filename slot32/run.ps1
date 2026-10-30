param(
    [int]$Port = 8080
)

# Load .env if present
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
        }
    }
}

if (-not $env:MONGODB_URI) {
    $env:MONGODB_URI = "mongodb://127.0.0.1:27017/sba301_slot32"
}

if ($PSBoundParameters.ContainsKey('Port')) {
    $env:SERVER_PORT = $Port.ToString()
} elseif (-not $env:SERVER_PORT) {
    $env:SERVER_PORT = "8080"
}

$targetPort = [int]$env:SERVER_PORT

# Check port availability
$occupied = Get-NetTCPConnection -LocalPort $targetPort -State Listen -ErrorAction SilentlyContinue
if ($occupied) {
    Write-Warning "Cong $targetPort dang duoc su dung boi PID $($occupied.OwningProcess[0])."
    $suggestedPort = 8081
    Write-Host "Tu dong chuyen sang cong du phong: $suggestedPort" -ForegroundColor Yellow
    $env:SERVER_PORT = $suggestedPort.ToString()
}

Write-Host "=== DANG KHOI CHAY SBA301 SLOT 32 ===" -ForegroundColor Cyan
Write-Host "MongoDB URI : $env:MONGODB_URI" -ForegroundColor Gray
Write-Host "Server Port : $env:SERVER_PORT" -ForegroundColor Gray
Write-Host "====================================" -ForegroundColor Cyan

mvn spring-boot:run
