
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID               primitive.ObjectID   `bson:"_id,omitempty"`
	Role             string               `bson:"role"` // "caregiver" or "patient"
	Name             string               `bson:"name"`
	Email            string               `bson:"email,omitempty"`        // Caregiver login
	Phone            string               `bson:"phone,omitempty"`
	PasswordHash     string               `bson:"passwordHash,omitempty"` // Caregiver only
	AssignedPatients []primitive.ObjectID `bson:"assignedPatients,omitempty"`
	AssignedCaregiver primitive.ObjectID  `bson:"assignedCaregiver,omitempty"`
	CreatedAt        primitive.DateTime   `bson:"createdAt"`
	UpdatedAt        primitive.DateTime   `bson:"updatedAt"`
}

type KnownFace struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	PatientID   primitive.ObjectID `bson:"patientId"`
	Name        string             `bson:"name"`
	Relationship string            `bson:"relationship"`
	Embedding   []float64          `bson:"embedding"`
	ImageURL    string             `bson:"imageUrl,omitempty"`
	Notes       string             `bson:"notes,omitempty"`
	LastSeen    primitive.DateTime `bson:"lastSeen"`
	CreatedAt   primitive.DateTime `bson:"createdAt"`
}

type Interaction struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	PatientID primitive.ObjectID `bson:"patientId"`
	FaceID    primitive.ObjectID `bson:"faceId"`
	Timestamp primitive.DateTime `bson:"timestamp"`
	Location  string             `bson:"location,omitempty"`
	Notes     string             `bson:"notes,omitempty"`
}

type MedicationReminder struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	PatientID   primitive.ObjectID `bson:"patientId"`
	Name        string             `bson:"name"`
	Dosage      string             `bson:"dosage"`
	Instructions string            `bson:"instructions"`
	Times       []string           `bson:"times"`          // ["13:00"]
	ImageURL    string             `bson:"imageUrl,omitempty"`
	DaysOfWeek  []int              `bson:"daysOfWeek,omitempty"` // 0=Sun
	CreatedBy   primitive.ObjectID `bson:"createdBy"`
	CreatedAt   primitive.DateTime `bson:"createdAt"`
}
type ARLabel struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	PatientID primitive.ObjectID `bson:"patientId"`
	Label     string             `bson:"label"`
	MarkerID  string             `bson:"markerId"` // e.g., QR/fiducial tag
	Type      string             `bson:"type"`     // "room" or "object"
	Notes     string             `bson:"notes,omitempty"`
	CreatedBy primitive.ObjectID `bson:"createdBy"`
}