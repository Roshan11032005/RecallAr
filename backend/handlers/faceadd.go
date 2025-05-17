package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddKnownFace(c *gin.Context) {
	// --- Step 1: JWT Auth (in handler) ---
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
		return
	}

	var tokenString string
	if _, err := fmt.Sscanf(authHeader, "Bearer %s", &tokenString); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Malformed Authorization header"})
		return
	}

	// Read RSA public key
	pubKeyBytes, err := os.ReadFile("publickey.pem")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read public key"})
		return
	}
	publicKey, err := jwt.ParseRSAPublicKeyFromPEM(pubKeyBytes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse public key"})
		return
	}

	// Parse JWT
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("Unexpected signing method")
		}
		return publicKey, nil
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	if claims["role"] != "caregiver" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only caregivers can add known faces"})
		return
	}

	// --- Step 2: Parse Request ---
	var req struct {
		PatientID    string    `json:"patientId" binding:"required"`
		Name         string    `json:"name" binding:"required"`
		Relationship string    `json:"relationship" binding:"required"`
		Embedding    []float64 `json:"embedding" binding:"required"`
		Notes        string    `json:"notes"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	patientOID, err := primitive.ObjectIDFromHex(req.PatientID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patientId"})
		return
	}

	now := primitive.NewDateTimeFromTime(time.Now())
	newFace := models.KnownFace{
		ID:           primitive.NewObjectID(),
		PatientID:    patientOID,
		Name:         req.Name,
		Relationship: req.Relationship,
		Embedding:    req.Embedding,
		Notes:        req.Notes,
		LastSeen:     now,
		CreatedAt:    now,
	}

	col := database.DB.Collection("known_faces")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = col.InsertOne(ctx, newFace)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save face: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Face added successfully",
		"faceId":  newFace.ID.Hex(),
	})
}
