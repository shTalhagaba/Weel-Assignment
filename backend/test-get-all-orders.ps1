# Test Get All Orders Endpoint
Write-Host "🧪 Testing Get All Orders Endpoint" -ForegroundColor Cyan

# Step 1: Login
Write-Host "`n=== STEP 1: LOGIN ===" -ForegroundColor Yellow
$loginBody = @{
    email = "user@example.com"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Set headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Get all orders for the user
Write-Host "`n=== STEP 2: GET ALL ORDERS ===" -ForegroundColor Yellow
try {
    $ordersResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method Get -Headers $headers
    Write-Host "✅ Orders retrieved successfully!" -ForegroundColor Green
    Write-Host "   Total orders: $($ordersResponse.data.Count)" -ForegroundColor Gray
    Write-Host "   Message: $($ordersResponse.message)" -ForegroundColor Gray
    
    # Display each order
    if ($ordersResponse.data.Count -gt 0) {
        Write-Host "`n📦 Order Details:" -ForegroundColor Cyan
        foreach ($order in $ordersResponse.data) {
            Write-Host "   --- Order ID: $($order.id) ---" -ForegroundColor Yellow
            Write-Host "   Type: $($order.delivery_type)" -ForegroundColor Gray
            Write-Host "   Created: $($order.created_at)" -ForegroundColor Gray
            if ($order.address) {
                Write-Host "   Address: $($order.address)" -ForegroundColor Gray
            }
            if ($order.vehicle_color -and $order.vehicle_model) {
                Write-Host "   Vehicle: $($order.vehicle_color) $($order.vehicle_model)" -ForegroundColor Gray
            }
            if ($order.delivery_time) {
                Write-Host "   Delivery Time: $($order.delivery_time)" -ForegroundColor Gray
            }
            Write-Host ""
        }
    } else {
        Write-Host "   No orders found for this user." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Get orders failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "🎉 Get All Orders Test Completed!" -ForegroundColor Cyan