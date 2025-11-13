package tests

import (
    "testing"
    "delivery-app/models"
)

func TestUserModel_Structure(t *testing.T) {
    user := models.User{
        Email:    "test@example.com",
        Password: "hashed_password",
    }
    
    if user.Email != "test@example.com" {
        t.Error("User email should be set correctly")
    }
    if user.Password != "hashed_password" {
        t.Error("User password should be set correctly")
    }
}

func TestOrderModel_Structure(t *testing.T) {
    order := models.Order{
        UserID:       1,
        DeliveryType: "DELIVERY",
        Address:      "123 Main St",
    }
    
    if order.UserID != 1 {
        t.Error("Order UserID should be set correctly")
    }
    if order.DeliveryType != "DELIVERY" {
        t.Error("Order delivery type should be set correctly")
    }
    if order.Address != "123 Main St" {
        t.Error("Order address should be set correctly")
    }
}

func TestLoginRequest_Structure(t *testing.T) {
    loginReq := models.LoginRequest{
        Email:    "user@example.com",
        Password: "password123",
    }
    
    if loginReq.Email != "user@example.com" {
        t.Error("Login email should be set correctly")
    }
    if loginReq.Password != "password123" {
        t.Error("Login password should be set correctly")
    }
}