package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Person represents the data structure for a person
type Person struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Relationship string    `json:"relationship"`
	Notes        string    `json:"notes"`
	ImagePath    string    `json:"image_path"`
	CreatedAt    time.Time `json:"created_at"`
}

// savePeople saves the people data to a JSON file
func savePeople(people []Person) error {
	data, err := json.MarshalIndent(people, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile("people.json", data, 0644)
}

// loadPeople loads the people data from a JSON file
func loadPeople() ([]Person, error) {
	data, err := ioutil.ReadFile("people.json")
	if err != nil {
		if os.IsNotExist(err) {
			return []Person{}, nil
		}
		return nil, err
	}
	var people []Person
	if err := json.Unmarshal(data, &people); err != nil {
		return nil, err
	}
	return people, nil
}

// AddPersonHandler handles POST /api/people to add a new person
func AddPersonHandler(c *gin.Context) {
	// Parse multipart form (max 10MB)
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	// Get form fields
	name := c.Request.FormValue("name")
	relationship := c.Request.FormValue("relationship")
	notes := c.Request.FormValue("notes")

	// Validate required fields
	if name == "" || relationship == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and relationship are required"})
		return
	}

	var imagePath string
	file, header, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()

		// Create images directory if it doesn't exist
		if err := os.MkdirAll("images", 0755); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create images directory"})
			return
		}

		// Generate unique filename
		ext := filepath.Ext(header.Filename)
		filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
		imagePath = filepath.Join("images", filename)

		// Save the image
		dst, err := os.Create(imagePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
	}

	// Load existing people
	people, err := loadPeople()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	// Create new person
	person := Person{
		ID:           uuid.New().String(),
		Name:         name,
		Relationship: relationship,
		Notes:        notes,
		ImagePath:    imagePath,
		CreatedAt:    time.Now(),
	}

	// Add to people slice and save
	people = append(people, person)
	if err := savePeople(people); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
		return
	}

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{
		"message": "Person added successfully",
		"id":      person.ID,
	})
}

// GetPeopleHandler handles GET /api/people/list to retrieve all people
func GetPeopleHandler(c *gin.Context) {
	people, err := loadPeople()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}
	c.JSON(http.StatusOK, people)
}
