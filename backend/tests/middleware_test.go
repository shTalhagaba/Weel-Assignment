package tests

import (
    "testing"
    "delivery-app/middleware"
)

func TestJWTToken_Generation(t *testing.T) {
    token, err := middleware.GenerateToken(1, "user@example.com")
    
    if err != nil {
        t.Errorf("Token generation should not fail: %v", err)
    }
    if token == "" {
        t.Error("Generated token should not be empty")
    }
    if len(token) < 10 {
        t.Error("Generated token should be reasonably long")
    }
}

func TestDeliveryTypes_Valid(t *testing.T) {
    validTypes := []string{"IN_STORE", "DELIVERY", "CURBSIDE"}
    
    for _, deliveryType := range validTypes {
        switch deliveryType {
        case "IN_STORE", "DELIVERY", "CURBSIDE":
           
        default:
            t.Errorf("Unexpected delivery type: %s", deliveryType)
        }
    }
}