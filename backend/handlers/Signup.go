package handlers

import (
    "context"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "golang.org/x/crypto/bcrypt"
   // "go.mongodb.org/mongo-driver/mongo"
    "backend/database" // Adjust import path based on your project structure
)

type CaregiverSignupRequest struct {
    Name     string `json:"name" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Phone    string `json:"phone" binding:"required"`
    Password string `json:"password" binding:"required,min=6"`
}

type User struct {
    ID               primitive.ObjectID   `bson:"_id,omitempty"`
    Role             string               `bson:"role"`
    Name             string               `bson:"name"`
    Email            string               `bson:"email"`
    Phone            string               `bson:"phone"`
    PasswordHash     string               `bson:"passwordHash"`
    AssignedPatients []primitive.ObjectID `bson:"assignedPatients,omitempty"`
    CreatedAt        time.Time            `bson:"createdAt"`
    UpdatedAt        time.Time            `bson:"updatedAt"`
}

func CaregiverSignup(c *gin.Context) {
    var req CaregiverSignupRequest

    // Bind JSON body into req struct
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if email already exists
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    usersCollection := database.DB.Collection("users")
    
    count, err := usersCollection.CountDocuments(ctx, map[string]string{"email": req.Email})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check email existence"})
        return
    }
    if count > 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email already registered"})
        return
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    now := time.Now()

    // Prepare user document
    user := User{
        Role:         "caregiver",
        Name:         req.Name,
        Email:        req.Email,
        Phone:        req.Phone,
        PasswordHash: string(hashedPassword),
        CreatedAt:    now,
        UpdatedAt:    now,
    }

    // Insert into MongoDB
    ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    _, err = usersCollection.InsertOne(ctx, user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Caregiver signed up successfully"})
}