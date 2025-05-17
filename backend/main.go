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
	"github.com/gin-gonic/gin"
	//"github.com/golang-jwt/jwt/v5"
	"io/ioutil"
	"net/http"
	"os"
)

var (
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
)

func generateAndStoreRSAKeys() error {
	// Generate RSA private key
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return err
	}

	// Save private key
	privateKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(privateKey),
	})
	if err := os.WriteFile("privatekey.pem", privateKeyPEM, 0600); err != nil {
		return err
	}

	// Save public key
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
	// Load private key
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

	// Load public key
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
	// Generate RSA keys if not already present
	if _, err := os.Stat("privatekey.pem"); os.IsNotExist(err) {
		if err := generateAndStoreRSAKeys(); err != nil {
			panic("Key generation failed: " + err.Error())
		}
	}

	// Load the generated RSA keys
	if err := loadRSAKeys(); err != nil {
		panic("Key load failed: " + err.Error())
	}

	// Connect to MongoDB
	database.ConnectMongo()

	// Initialize Gin
	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to Gin!"})
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	v1 := router.Group("/mobile")
	{
		v1.POST("/login", handlers.MobileLogin)
	}

	v2 := router.Group("/web")
	{
		v2.POST("/caregiver/signup",handlers.CaregiverSignup)
	}

	router.Run(":8090")
}
