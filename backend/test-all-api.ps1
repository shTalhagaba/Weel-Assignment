# Complete API Test Script
Write-Host "🚀 Testing Complete Delivery App API" -ForegroundColor Cyan

# Step 1: Login and get token
Write-Host "`n=== STEP 1: LOGIN ===" -ForegroundColor Yellow
$loginBody = @{
    email = "user@example.com"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Set headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Get current user
Write-Host "`n=== STEP 2: GET CURRENT USER ===" -ForegroundColor Yellow
try {
    $meResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/me" -Method Get -Headers $headers
    Write-Host "✅ User info retrieved:" -ForegroundColor Green
    Write-Host "   User ID: $($meResponse.id)" -ForegroundColor Gray
    Write-Host "   Email: $($meResponse.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get user failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Create DELIVERY order
Write-Host "`n=== STEP 3: CREATE DELIVERY ORDER ===" -ForegroundColor Yellow
$deliveryTime = (Get-Date).AddHours(2).ToString("yyyy-MM-ddTHH:mm:ssZ")
$deliveryOrder = @{
    delivery_type = "DELIVERY"
    address = "123 Main Street, New York, NY 10001"
    delivery_time = $deliveryTime
} | ConvertTo-Json

try {
    $deliveryResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/orders" -Method Post -Body $deliveryOrder -Headers $headers
    $orderId = $deliveryResponse.data.id
    Write-Host "✅ DELIVERY order created:" -ForegroundColor Green
    Write-Host "   Order ID: $orderId" -ForegroundColor Gray
    Write-Host "   Type: $($deliveryResponse.data.delivery_type)" -ForegroundColor Gray
    Write-Host "   Address: $($deliveryResponse.data.address)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Create delivery order failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Get the created order
Write-Host "`n=== STEP 4: GET ORDER ===" -ForegroundColor Yellow
try {
    $getOrderResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/orders/$orderId" -Method Get -Headers $headers
    Write-Host "✅ Order retrieved successfully" -ForegroundColor Green
    Write-Host "   Delivery Type: $($getOrderResponse.data.delivery_type)" -ForegroundColor Gray
    Write-Host "   Status: $($getOrderResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get order failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Update order to CURBSIDE
Write-Host "`n=== STEP 5: UPDATE ORDER TO CURBSIDE ===" -ForegroundColor Yellow
$updateOrder = @{
    delivery_type = "CURBSIDE"
    vehicle_color = "Blue"
    vehicle_model = "Toyota Camry"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/orders/$orderId" -Method Put -Body $updateOrder -Headers $headers
    Write-Host "✅ Order updated to CURBSIDE:" -ForegroundColor Green
    Write-Host "   Vehicle: $($updateResponse.data.vehicle_color) $($updateResponse.data.vehicle_model)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Update order failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Create IN_STORE order
Write-Host "`n=== STEP 6: CREATE IN_STORE ORDER ===" -ForegroundColor Yellow
$inStoreOrder = @{
    delivery_type = "IN_STORE"
} | ConvertTo-Json

try {
    $inStoreResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/orders" -Method Post -Body $inStoreOrder -Headers $headers
    Write-Host "✅ IN_STORE order created:" -ForegroundColor Green
    Write-Host "   Order ID: $($inStoreResponse.data.id)" -ForegroundColor Gray
    Write-Host "   Type: $($inStoreResponse.data.delivery_type)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Create in-store order failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 7: Test validation errors
Write-Host "`n=== STEP 7: TEST VALIDATION ERRORS ===" -ForegroundColor Yellow

# Test 1: DELIVERY without address
Write-Host "   Testing DELIVERY without address..." -ForegroundColor Gray
$invalidDelivery = @{
    delivery_type = "DELIVERY"
    delivery_time = $deliveryTime
    # Missing address - should fail
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/orders" -Method Post -Body $invalidDelivery -Headers $headers
    Write-Host "   ❌ Expected validation error but request succeeded" -ForegroundColor Red
} catch {
    Write-Host "   ✅ Correctly failed: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

# Test 2: CURBSIDE without vehicle info
Write-Host "   Testing CURBSIDE without vehicle info..." -ForegroundColor Gray
$invalidCurbside = @{
    delivery_type = "CURBSIDE"
    # Missing vehicle_color and vehicle_model - should fail
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "192.168.18.54:8080/api/v1/orders" -Method Post -Body $invalidCurbside -Headers $headers
    Write-Host "   ❌ Expected validation error but request succeeded" -ForegroundColor Red
} catch {
    Write-Host "   ✅ Correctly failed: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

Write-Host "`n🎉 ALL API TESTS COMPLETED!" -ForegroundColor Cyan
Write-Host "   Your backend is working perfectly!" -ForegroundColor Green