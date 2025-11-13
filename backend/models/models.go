package models

import (
    "time"
)

type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Email     string    `gorm:"uniqueIndex;not null" json:"email"`
    Password  string    `gorm:"not null" json:"-"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type Order struct {
    ID              uint            `gorm:"primaryKey" json:"id"`
    UserID          uint            `gorm:"not null;index" json:"user_id"`
    DeliveryType    string          `gorm:"type:varchar(20);not null" json:"delivery_type"` 
    Address         string          `gorm:"type:text" json:"address,omitempty"`
    DeliveryTime    *time.Time      `json:"delivery_time,omitempty"`
    VehicleColor    string          `gorm:"type:varchar(50)" json:"vehicle_color,omitempty"`
    VehicleModel    string          `gorm:"type:varchar(50)" json:"vehicle_model,omitempty"`
    CreatedAt       time.Time       `json:"created_at"`
    UpdatedAt       time.Time       `json:"updated_at"`
    
    User            User            `gorm:"foreignKey:UserID" json:"user,omitempty"`
}


type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

type LoginResponse struct {
    Token string `json:"token"`
    User  struct {
        ID    uint   `json:"id"`
        Email string `json:"email"`
    } `json:"user"`
}

type OrderRequest struct {
    DeliveryType string     `json:"delivery_type" binding:"required,oneof=IN_STORE DELIVERY CURBSIDE"`
    Address      string     `json:"address,omitempty"`
    DeliveryTime *time.Time `json:"delivery_time,omitempty"`
    VehicleColor string     `json:"vehicle_color,omitempty"`
    VehicleModel string     `json:"vehicle_model,omitempty"`
}

type ErrorResponse struct {
    Error string `json:"error"`
}

type SuccessResponse struct {
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}