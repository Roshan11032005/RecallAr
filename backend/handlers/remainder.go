package handlers

import (
	"backend/database" // adjust this to your actual module path
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Reminder defines the structure of a reminder document
type Reminder struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `json:"title" binding:"required"`
	Description string             `json:"description"`
	Date        string             `json:"date" binding:"required"`     // format: YYYY-MM-DD
	Time        string             `json:"time" binding:"required"`     // format: HH:MM
	Recurring   string             `json:"recurring"`                   // none, daily, weekly, etc.
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}

// AddReminder handles POST request to create a new reminder
func AddReminder(c *gin.Context) {
	var req Reminder

	// Validate and bind JSON
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()
	req.ID = primitive.NewObjectID()
	req.CreatedAt = now
	req.UpdatedAt = now

	// Insert into MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := database.DB.Collection("reminders")
	_, err := collection.InsertOne(ctx, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save reminder"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Reminder added successfully", "reminder": req})
}

// GetReminders handles GET request to fetch all reminders
func GetReminders(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := database.DB.Collection("reminders")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reminders"})
		return
	}
	defer cursor.Close(ctx)

	var reminders []Reminder
	if err := cursor.All(ctx, &reminders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode reminders"})
		return
	}

	c.JSON(http.StatusOK, reminders)
}
