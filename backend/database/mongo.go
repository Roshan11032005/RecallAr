package database

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var DB *mongo.Database

func ConnectMongo() {
	// Updated URI with DB name and retryWrites parameter
	uri := "mongodb+srv://roshanzameer112005:6mwCjLAcn0yGR58j@cluster0.qphuaoq.mongodb.net/recallAR?retryWrites=true&w=majority"

	// Enforce TLS 1.2 minimum version
	clientOptions := options.Client().ApplyURI(uri).SetTLSConfig(&tls.Config{
		MinVersion: tls.VersionTLS12,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("❌ MongoDB connection error:", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("❌ MongoDB ping error:", err)
	}

	fmt.Println("✅ Connected to MongoDB!")

	Client = client
	DB = client.Database("recallAR")
}
