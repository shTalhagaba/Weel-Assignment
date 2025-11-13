package database

import (
    "fmt"
    "log"
    "os"
    "time"
    "delivery-app/models"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
    "github.com/joho/godotenv"
)

var DB *gorm.DB

func Connect() error {
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, using default values")
    }

    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
        getEnv("DB_HOST", "localhost"),
        getEnv("DB_USER", "postgres"), 
        getEnv("DB_PASSWORD", "password"),
        getEnv("DB_NAME", "deliveryapp"),
        getEnv("DB_PORT", "5432"),
    )

    log.Printf("Connecting to database on Windows: %s@%s:%s/%s", 
        getEnv("DB_USER", "postgres"),
        getEnv("DB_HOST", "localhost"), 
        getEnv("DB_PORT", "5432"),
        getEnv("DB_NAME", "deliveryapp"),
    )
    
    newLogger := logger.New(
        log.New(os.Stdout, "\r\n", log.LstdFlags),
        logger.Config{
            SlowThreshold: time.Second,
            LogLevel:      logger.Info,
            Colorful:      true,
        },
    )
    
    var db *gorm.DB
    maxRetries := 5
    for i := 1; i <= maxRetries; i++ {
        db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
            Logger: newLogger,
        })
        if err == nil {
            break
        }
        log.Printf("Database connection attempt %d/%d failed: %v", i, maxRetries, err)
        if i < maxRetries {
            time.Sleep(3 * time.Second)
        }
    }
    
    if err != nil {
        return fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
    }

    DB = db

    err = DB.AutoMigrate(&models.User{}, &models.Order{})
    if err != nil {
        return fmt.Errorf("failed to migrate database: %w", err)
    }

    log.Println("Database connected successfully")
    return nil
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}

func SeedData() error {
    var count int64
    DB.Model(&models.User{}).Count(&count)
    
    if count == 0 {
        users := []models.User{
            {
                Email:    "user@example.com",
                Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
            },
            {
                Email:    "test@example.com", 
                Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
            },
        }
        
        for _, user := range users {
            if err := DB.Create(&user).Error; err != nil {
                return fmt.Errorf("failed to seed user: %w", err)
            }
        }
        
        log.Println("Seed users created:")
        log.Println("user@example.com / password")
        log.Println("test@example.com / password")
    }
    
    return nil
}
