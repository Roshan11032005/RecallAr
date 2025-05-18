package handlers

import (
	"encoding/base64"
	"encoding/json"
	"image"
	"image/jpeg"
	"image/png"
	"bytes"
	"net/http"
	"os"
	"path/filepath"


	"github.com/corona10/goimagehash"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type ImagePayload struct {
	ImageBase64 string `json:"image"`
}

type MatchResponse struct {
	Name string `json:"name"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func decodeImage(data []byte) (image.Image, error) {
	img, err := png.Decode(bytes.NewReader(data))
	if err == nil {
		return img, nil
	}
	// fallback to jpeg decode
	img, err = jpeg.Decode(bytes.NewReader(data))
	return img, err
}

func FaceMatchWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to websocket"})
		return
	}
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		var payload ImagePayload
		if err := json.Unmarshal(message, &payload); err != nil {
			conn.WriteJSON(gin.H{"error": "Invalid JSON"})
			continue
		}

		imageBytes, err := base64.StdEncoding.DecodeString(payload.ImageBase64)
		if err != nil {
			conn.WriteJSON(gin.H{"error": "Invalid base64 image"})
			continue
		}

		inputImg, err := decodeImage(imageBytes)
		if err != nil {
			conn.WriteJSON(gin.H{"error": "Failed to decode input image"})
			continue
		}

		inputHash, err := goimagehash.AverageHash(inputImg)
		if err != nil {
			conn.WriteJSON(gin.H{"error": "Failed to compute hash"})
			continue
		}

		people, err := loadPeople()
		if err != nil {
			conn.WriteJSON(gin.H{"error": "Failed to load people data"})
			continue
		}

		const similarityThreshold = 26// tune this threshold (like your Python example)

		matchedName := "Stranger"
		for _, person := range people {
			if person.ImagePath == "" {
				continue
			}

			// Read stored image bytes
			imgData, err := os.ReadFile(filepath.Clean(person.ImagePath))
			if err != nil {
				continue
			}

			dbImg, err := decodeImage(imgData)
			if err != nil {
				continue
			}

			dbHash, err := goimagehash.AverageHash(dbImg)
			if err != nil {
				continue
			}

			distance, err := inputHash.Distance(dbHash)
			if err != nil {
				continue
			}

			if distance < similarityThreshold {
				matchedName = person.Name
				break
			}
		}

		conn.WriteJSON(MatchResponse{Name: matchedName})
	}
}
