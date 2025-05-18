package main

import (
	"backend/database"
	"backend/handlers"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"os"
)

var (
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
)

func generateAndStoreRSAKeys() error {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return err
	}

	privateKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(privateKey),
	})
	if err := os.WriteFile("privatekey.pem", privateKeyPEM, 0600); err != nil {
		return err
	}

	pubASN1, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return err
	}
	publicKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: pubASN1,
	})
	if err := os.WriteFile("publickey.pem", publicKeyPEM, 0644); err != nil {
		return err
	}

	fmt.Println("RSA key pair generated and saved to root folder.")
	return nil
}

func loadRSAKeys() error {
	privBytes, err := ioutil.ReadFile("privatekey.pem")
	if err != nil {
		return err
	}
	block, _ := pem.Decode(privBytes)
	if block == nil || block.Type != "RSA PRIVATE KEY" {
		return errors.New("invalid private key")
	}
	PrivateKey, err = x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return err
	}

	pubBytes, err := ioutil.ReadFile("publickey.pem")
	if err != nil {
		return err
	}
	block, _ = pem.Decode(pubBytes)
	if block == nil || block.Type != "PUBLIC KEY" {
		return errors.New("invalid public key")
	}
	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return err
	}
	PublicKey = pub.(*rsa.PublicKey)
	return nil
}

func main() {
	if _, err := os.Stat("privatekey.pem"); os.IsNotExist(err) {
		if err := generateAndStoreRSAKeys(); err != nil {
			panic("Key generation failed: " + err.Error())
		}
	}

	if err := loadRSAKeys(); err != nil {
		panic("Key load failed: " + err.Error())
	}

	database.ConnectMongo()

	router := gin.Default()

	// ✅ Fixed CORS config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // no trailing slash
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to Gin!"})
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})
   router.GET("/ws/face-match", handlers.FaceMatchWebSocket)
	v1 := router.Group("/mobile")
	{
		v1.POST("/login", handlers.MobileLogin)
		v1.POST("/alert",handlers.AlertHandler)
	}

	v2 := router.Group("/web")
	{
		v2.POST("/caregiver/signup", handlers.CaregiverSignup)
		v2.POST("/caregiver/login", handlers.WebLogin)
		v2.POST("/caregiver/addface", handlers.AddPersonHandler)
		v2.POST("/cargiver/remainder",handlers.AddReminder)
		v2.POST("/caregiver/reminder-get",handlers.GetReminders)
		v2.POST("/add",handlers.AddPersonHandler)
		v2.GET("/getpeople",handlers.GetPeopleHandler)
	}

	router.Run(":8091")
}
