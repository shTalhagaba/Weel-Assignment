package main

import (
    "log"
    "os"
    "delivery-app/database"
    "delivery-app/handlers"
    "delivery-app/middleware"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    
    if os.Getenv("GIN_MODE") == "release" {
        gin.SetMode(gin.ReleaseMode)
    }

    
    if err := database.Connect(); err != nil {
        log.Fatal("❌ Database connection failed:", err)
    }

    
    if err := database.SeedData(); err != nil {
        log.Fatal("❌ Seeding failed:", err)
    }

    r := gin.Default()

 
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * 60 * 60, 
    }))

   
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status": "OK",
            "service": "delivery-app-backend",
        })
    })

  
    public := r.Group("/api/v1")
    {
        public.POST("/auth/login", handlers.Login)
    }

 
    protected := r.Group("/api/v1")
    protected.Use(middleware.AuthMiddleware())
    {
        protected.GET("/me", handlers.GetMe)
        protected.POST("/orders", handlers.CreateOrder)
        protected.GET("/orders", handlers.GetUserOrders)  
        protected.GET("/orders/:id", handlers.GetOrder)
        protected.PUT("/orders/:id", handlers.UpdateOrder)
    }

    log.Println("🚀 Server starting on :8080")
    log.Println("📚 API Documentation:")
    log.Println("   POST /api/v1/auth/login - User login")
    log.Println("   GET  /api/v1/me - Get current user")
    log.Println("   POST /api/v1/orders - Create order")
    log.Println("   GET  /api/v1/orders/:id - Get order")
    log.Println("   GET  /api/v1/orders - Get all user orders")
    log.Println("   PUT  /api/v1/orders/:id - Update order")
    
    if err := r.Run(":8080"); err != nil {
        log.Fatal("❌ Server failed to start:", err)
    }
}