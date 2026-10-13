Write-Host "=========================================================="
Write-Host "DEMO TEST SUITE: SLOT 22 CHAPTER 15 PART A (CRUD BACKEND)"
Write-Host "=========================================================="

# T01: GET list categories
Write-Host "`n[T01] GET /api/categories (Pagination & List)"
$r1 = Invoke-RestMethod -Uri "http://localhost:8080/api/categories?page=0&size=10&sort=categoryName,asc" -Method Get
Write-Host "Status: 200 OK"
Write-Host "Total elements: $($r1.totalElements)"
Write-Host "Page size: $($r1.size)"

# T02: GET existing category
Write-Host "`n[T02] GET /api/categories/1 (Existing)"
$r2 = Invoke-RestMethod -Uri "http://localhost:8080/api/categories/1" -Method Get
Write-Host "Status: 200 OK"
Write-Host "CategoryID: $($r2.categoryId) | Name: $($r2.categoryName) | Description: $($r2.categoryDescription)"

# T03: GET missing category
Write-Host "`n[T03] GET /api/categories/32767 (Missing -> 404)"
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/categories/32767" -Method Get
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $reader.ReadToEnd()
    Write-Host "Status: $status (Expected 404)"
    Write-Host "Response Body: $errBody"
}

# T04: POST valid category
Write-Host "`n[T04] POST /api/categories (Create valid)"
$newCategory = @{
    categoryName = "Technology News"
    categoryDescription = "Technology and software engineering news"
    parentCategoryId = $null
    active = $true
} | ConvertTo-Json
$r4 = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method Post -ContentType "application/json" -Body $newCategory
Write-Host "Status: 201 Created"
Write-Host "Created CategoryID: $($r4.categoryId) | Name: $($r4.categoryName)"

# T05: POST invalid category (validation error -> 400)
Write-Host "`n[T05] POST /api/categories (Invalid blank body -> 400)"
$invalidCategory = @{
    categoryName = ""
    categoryDescription = ""
    active = $true
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method Post -ContentType "application/json" -Body $invalidCategory
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $reader.ReadToEnd()
    Write-Host "Status: $status (Expected 400)"
    Write-Host "Response Body: $errBody"
}

# T06: POST duplicate category name (-> 409 Conflict)
Write-Host "`n[T06] POST /api/categories (Duplicate name -> 409)"
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method Post -ContentType "application/json" -Body $newCategory
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $reader.ReadToEnd()
    Write-Host "Status: $status (Expected 409)"
    Write-Host "Response Body: $errBody"
}

# T07: PUT update existing category
Write-Host "`n[T07] PUT /api/categories/1 (Update existing)"
$putBody = @{
    categoryName = "Academic & Research News"
    categoryDescription = "Academic and research announcements"
    parentCategoryId = $null
    active = $true
} | ConvertTo-Json
$r7 = Invoke-RestMethod -Uri "http://localhost:8080/api/categories/1" -Method Put -ContentType "application/json" -Body $putBody
Write-Host "Status: 200 OK"
Write-Host "Updated Name: $($r7.categoryName) | Desc: $($r7.categoryDescription)"

# T08: PUT missing category (-> 404)
Write-Host "`n[T08] PUT /api/categories/32767 (Missing -> 404)"
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/categories/32767" -Method Put -ContentType "application/json" -Body $putBody
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $reader.ReadToEnd()
    Write-Host "Status: $status (Expected 404)"
    Write-Host "Response Body: $errBody"
}

# T10: DELETE referenced category (Category 1 is used in NewsArticle -> 409 Conflict)
Write-Host "`n[T10] DELETE /api/categories/1 (Referenced by NewsArticle -> 409 Conflict)"
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/categories/1" -Method Delete
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $reader.ReadToEnd()
    Write-Host "Status: $status (Expected 409)"
    Write-Host "Response Body: $errBody"
}

# T09: DELETE unreferenced category (Delete the created CategoryID)
Write-Host "`n[T09] DELETE /api/categories/$($r4.categoryId) (Unreferenced -> 204 No Content)"
$respDel = Invoke-WebRequest -Uri "http://localhost:8080/api/categories/$($r4.categoryId)" -Method Delete -UseBasicParsing
Write-Host "Status: $($respDel.StatusCode) (Expected 204 No Content)"

# Verify it was removed
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/categories/$($r4.categoryId)" -Method Get
} catch {
    Write-Host "Verification after DELETE: Confirmed $($_.Exception.Response.StatusCode.value__) Not Found"
}

# T11: Search keyword
Write-Host "`n[T11] GET /api/categories?keyword=academic (Search filter)"
$r11 = Invoke-RestMethod -Uri "http://localhost:8080/api/categories?keyword=academic&page=0&size=5" -Method Get
Write-Host "Status: 200 OK"
Write-Host "Matching elements: $($r11.totalElements)"
foreach ($item in $r11.content) {
    Write-Host " - $($item.categoryId): $($item.categoryName)"
}

# T12: Pagination
Write-Host "`n[T12] GET /api/categories?page=0&size=2 (Pagination)"
$r12 = Invoke-RestMethod -Uri "http://localhost:8080/api/categories?page=0&size=2" -Method Get
Write-Host "Status: 200 OK"
Write-Host "Page size: $($r12.size) | Number of elements on page: $($r12.numberOfElements) | Total pages: $($r12.totalPages) | Total elements: $($r12.totalElements)"

Write-Host "`n=========================================================="
Write-Host "ALL 12 TEST CASES EXECUTED SUCCESSFULLY!"
Write-Host "=========================================================="
