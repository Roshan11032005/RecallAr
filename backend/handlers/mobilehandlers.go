package handlers

import (
	"backend/database"
	"backend/models"
	"golang.org/x/crypto/bcrypt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"context"
	"net/http"
	"time"
	"os"
	// Import your main package for RSA key access
)

func MobileLogin(c *gin.Context) {
	
	var reqBody struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userCollection := database.DB.Collection("users")

	var user models.User
	err := userCollection.FindOne(ctx, bson.M{
		"email": reqBody.Email,
		"role":  "caregiver", // Only caregivers can log in
	}, options.FindOne()).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(reqBody.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate JWT token (valid for 30 days)
	claims := jwt.MapClaims{
		"userId": user.ID.Hex(),
		"email":  user.Email,
		"role":   user.Role,
		"exp":    time.Now().Add(30 * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	// Load private key from file
keyData, err := os.ReadFile("privatekey.pem")
if err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read private key"})
	return
}

privateKey, err := jwt.ParseRSAPrivateKeyFromPEM(keyData)
if err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse private key"})
	return
}

// Sign the token
tokenString, err := token.SignedString(privateKey)
if err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign token"})
	return
}


	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":    user.ID.Hex(),
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
