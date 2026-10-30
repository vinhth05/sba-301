param(
    [int]$Port = 8081
)

$base = "http://localhost:$Port"
try {
    $null = Invoke-RestMethod -Uri "$base/actuator/health" -TimeoutSec 2 -ErrorAction Stop
} catch {
    if ($Port -eq 8081) {
        $base = "http://localhost:8080"
    } else {
        $base = "http://localhost:8081"
    }
}

Write-Host "API Base URL: $base" -ForegroundColor Cyan

Write-Host "1. Kiem tra MongoDB status (/api/lab/status):" -ForegroundColor Yellow
$status = Invoke-RestMethod "$base/api/lab/status"
$status | ConvertTo-Json -Depth 3

Write-Host "`n2. Seed du lieu mau (/api/lab/seed):" -ForegroundColor Yellow
$seed = Invoke-RestMethod -Method Post "$base/api/lab/seed"
$seed | ConvertTo-Json -Depth 3

Write-Host "`n3. Lay danh sach san pham co HDMI (/api/products?hdmi=true):" -ForegroundColor Yellow
$hdmi = Invoke-RestMethod "$base/api/products?hdmi=true"
$hdmi | ConvertTo-Json -Depth 3

Write-Host "`n4. Lay danh sach danh muc (/api/categories):" -ForegroundColor Yellow
$categories = Invoke-RestMethod "$base/api/categories"
$categories | ConvertTo-Json -Depth 3

Write-Host "`n=== TAT CA KIEM TRA THANH CONG! ===" -ForegroundColor Green
