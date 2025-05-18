import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

# Load dataset and drop unnecessary columns
df = pd.read_csv('/content/alzheimers_disease_data.csv')
df = df.drop(columns=['PatientID', 'DoctorInCharge'])

# Manually specify categorical columns to encode
categorical_cols = ['Gender', 'Ethnicity', 'EducationLevel']

label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# Encode target
target_encoder = LabelEncoder()
df['Diagnosis'] = target_encoder.fit_transform(df['Diagnosis'])

# Split data
X = df.drop(columns=['Diagnosis'])
y = df['Diagnosis']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = XGBClassifier(eval_metric='logloss')
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy on test data: {accuracy:.2f}")
print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

# Prepare sample input using label encoders
sample_input = {
    'Age': 70,
    'Gender': label_encoders['Gender'].transform(['Male'])[0],
    'Ethnicity': label_encoders['Ethnicity'].transform(['Caucasian'])[0],
    'EducationLevel': label_encoders['EducationLevel'].transform(['High School'])[0],
    'BMI': 27.5,
    'Smoking': 1,
    'AlcoholConsumption': 0,
    'PhysicalActivity': 3,
    'DietQuality': 2,
    'SleepQuality': 2,
    'FamilyHistoryAlzheimers': 1,
    'CardiovascularDisease': 0,
    'Diabetes': 0,
    'Depression': 1,
    'HeadInjury': 0,
    'Hypertension': 1,
    'SystolicBP': 140,
    'DiastolicBP': 85,
    'CholesterolTotal': 200,
    'CholesterolLDL': 130,
    'CholesterolHDL': 50,
    'CholesterolTriglycerides': 150,
    'MMSE': 25,
    'FunctionalAssessment': 1,
    'MemoryComplaints': 1,
    'BehavioralProblems': 0,
    'ADL': 1,
    'Confusion': 0,
    'Disorientation': 0,
    'PersonalityChanges': 0,
    'DifficultyCompletingTasks': 0,
    'Forgetfulness': 1
}

sample_df = pd.DataFrame([sample_input])
sample_pred_encoded = model.predict(sample_df)
sample_pred_label = target_encoder.inverse_transform(sample_pred_encoded)
print(f"Prediction for sample input: {sample_pred_label[0]}")
