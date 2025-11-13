package handlers

import (
    "net/http"
    "time"
    "fmt"
    "delivery-app/models"
    "delivery-app/database"
    "github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    
    var req models.OrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{
            Error: fmt.Sprintf("Validation error: %s", err.Error()),
        })
        return
    }

    if err := validateOrderRequest(req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{
            Error: err.Error(),
        })
        return
    }

    order := models.Order{
        UserID:       userID,
        DeliveryType: req.DeliveryType,
        Address:      req.Address,
        DeliveryTime: req.DeliveryTime,
        VehicleColor: req.VehicleColor,
        VehicleModel: req.VehicleModel,
    }

    if err := database.DB.Create(&order).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.ErrorResponse{
            Error: "Could not create order",
        })
        return
    }

    database.DB.Preload("User").First(&order, order.ID)

    c.JSON(http.StatusCreated, models.SuccessResponse{
        Message: "Order created successfully",
        Data:    order,
    })
}

func GetOrder(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    orderID := c.Param("id")

    var order models.Order
    if err := database.DB.Preload("User").Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
        c.JSON(http.StatusNotFound, models.ErrorResponse{
            Error: "Order not found",
        })
        return
    }

    c.JSON(http.StatusOK, models.SuccessResponse{
        Message: "Order retrieved successfully",
        Data:    order,
    })
}

func UpdateOrder(c *gin.Context) {
    userID := c.MustGet("userID").(uint)
    orderID := c.Param("id")

    var order models.Order
    if err := database.DB.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
        c.JSON(http.StatusNotFound, models.ErrorResponse{
            Error: "Order not found",
        })
        return
    }

    var req models.OrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{
            Error: fmt.Sprintf("Validation error: %s", err.Error()),
        })
        return
    }

    if err := validateOrderRequest(req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{
            Error: err.Error(),
        })
        return
    }

    order.DeliveryType = req.DeliveryType
    order.Address = req.Address
    order.DeliveryTime = req.DeliveryTime
    order.VehicleColor = req.VehicleColor
    order.VehicleModel = req.VehicleModel

    if err := database.DB.Save(&order).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.ErrorResponse{
            Error: "Could not update order",
        })
        return
    }

    database.DB.Preload("User").First(&order, order.ID)

    c.JSON(http.StatusOK, models.SuccessResponse{
        Message: "Order updated successfully",
        Data:    order,
    })
}

func GetUserOrders(c *gin.Context) {
    userID := c.MustGet("userID").(uint)

    var orders []models.Order
    if err := database.DB.Preload("User").Where("user_id = ?", userID).Order("created_at DESC").Find(&orders).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.ErrorResponse{
            Error: "Could not retrieve orders",
        })
        return
    }

    if orders == nil {
        orders = []models.Order{}
    }

    c.JSON(http.StatusOK, models.SuccessResponse{
        Message: "Orders retrieved successfully",
        Data:    orders,
    })
}

func validateOrderRequest(req models.OrderRequest) error {
    now := time.Now()
    
    switch req.DeliveryType {
    case "DELIVERY":
        if req.Address == "" {
            return fmt.Errorf("address is required for DELIVERY")
        }
        if req.DeliveryTime == nil {
            return fmt.Errorf("delivery_time is required for DELIVERY")
        }
        if req.DeliveryTime.Before(now) {
            return fmt.Errorf("delivery_time must be in the future")
        }
    case "CURBSIDE":
        if req.VehicleColor == "" {
            return fmt.Errorf("vehicle_color is required for CURBSIDE")
        }
        if req.VehicleModel == "" {
            return fmt.Errorf("vehicle_model is required for CURBSIDE")
        }
    case "IN_STORE":
    default:
        return fmt.Errorf("invalid delivery type: %s", req.DeliveryType)
    }
    return nil
}
