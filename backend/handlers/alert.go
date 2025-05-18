package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "gopkg.in/gomail.v2"
    "log"
    "fmt"
)

type AlertRequest struct {
    UserID   string   `json:"userId" binding:"required"`
    Location Location `json:"location" binding:"required"`
}

type Location struct {
    Latitude  float64 `json:"latitude" binding:"required"`
    Longitude float64 `json:"longitude" binding:"required"`
}


func AlertHandler(c *gin.Context) {
    var alertReq AlertRequest
    if err := c.ShouldBindJSON(&alertReq); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // TODO: Replace with real caretaker email lookup for this userID
    caretakerEmail := "sroshanzameer_cse2205j3@mgit.ac.in"

    subject := fmt.Sprintf("Alert: User %s moved outside safe zone", alertReq.UserID)
    body := fmt.Sprintf(
        "User %s has moved outside the safe zone.\nCurrent location:\nLatitude: %f\nLongitude: %f\n",
        alertReq.UserID, alertReq.Location.Latitude, alertReq.Location.Longitude,
    )

    if err := sendEmail(caretakerEmail, subject, body); err != nil {
        log.Printf("Failed to send email: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send alert email"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "alert sent"})
}

func sendEmail(to, subject, body string) error {
    m := gomail.NewMessage()
    m.SetHeader("From", "roshanzameer111000@gmail.com") // your email here
    m.SetHeader("To", to)
    m.SetHeader("Subject", subject)
    m.SetBody("text/plain", body)

    d := gomail.NewDialer("smtp.gmail.com", 587, "roshanzameer111000@gmail.com", "ehva migj lskl ygdc")

    return d.DialAndSend(m)
}
