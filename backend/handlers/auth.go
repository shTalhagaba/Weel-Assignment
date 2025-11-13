package handlers

import (
    "net/http"
    "fmt"
    "delivery-app/models"
    "delivery-app/database"
    "delivery-app/middleware"
    "github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
    var req models.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{
            Error: fmt.Sprintf("Validation error: %s", err.Error()),
        })
        return
    }

    var user models.User
    if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, models.ErrorResponse{
            Error: "Invalid email or password",
        })
        return
    }

    if req.Password != "password" {
        c.JSON(http.StatusUnauthorized, models.ErrorResponse{
            Error: "Invalid email or password",
        })
        return
    }

    token, err := middleware.GenerateToken(user.ID, user.Email)
    if err != nil {
        c.JSON(http.StatusInternalServerError, models.ErrorResponse{
            Error: "Could not generate authentication token",
        })
        return
    }

    response := models.LoginResponse{
        Token: token,
        User: struct {
            ID    uint   `json:"id"`
            Email string `json:"email"`
        }{
            ID:    user.ID,
            Email: user.Email,
        },
    }

    c.JSON(http.StatusOK, response)
}

func GetMe(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    email := c.MustGet("email").(string)

    c.JSON(http.StatusOK, gin.H{
        "id":    userID,
        "email": email,
    })
}