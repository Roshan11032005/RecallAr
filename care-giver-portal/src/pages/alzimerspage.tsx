import React, { useState } from "react";

const initialState = {
  Age: "",
  Gender: "",
  Ethnicity: "",
  EducationLevel: "",
  BMI: "",
  Smoking: "",
  AlcoholConsumption: "",
  PhysicalActivity: "",
  DietQuality: "",
  SleepQuality: "",
  FamilyHistoryAlzheimers: "",
  CardiovascularDisease: "",
  Diabetes: "",
  Depression: "",
  HeadInjury: "",
  Hypertension: "",
  SystolicBP: "",
  DiastolicBP: "",
  CholesterolTotal: "",
  CholesterolLDL: "",
  CholesterolHDL: "",
  CholesterolTriglycerides: "",
  MMSE: "",
  FunctionalAssessment: "",
  MemoryComplaints: "",
  BehavioralProblems: "",
  ADL: "",
  Confusion: "",
  Disorientation: "",
  PersonalityChanges: "",
  DifficultyCompletingTasks: "",
  Forgetfulness: "",
};

function AlzheimersPrediction() {
  const [formData, setFormData] = useState(initialState);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const transformFormData = (data) => {
    try {
      return {
        Age: Number(data.Age),
        Gender: data.Gender === "Male" ? 0 : 1,
        Ethnicity: ["Caucasian", "African American", "Asian", "Hispanic", "Other"].indexOf(data.Ethnicity),
        EducationLevel: ["None", "High School", "Bachelor", "Higher"].indexOf(data.EducationLevel),
        BMI: Number(data.BMI),
        Smoking: data.Smoking === "Yes" ? 1 : 0,
        AlcoholConsumption: Number(data.AlcoholConsumption),
        PhysicalActivity: Number(data.PhysicalActivity),
        DietQuality: Number(data.DietQuality),
        SleepQuality: Number(data.SleepQuality),
        FamilyHistoryAlzheimers: data.FamilyHistoryAlzheimers === "Yes" ? 1 : 0,
        CardiovascularDisease: data.CardiovascularDisease === "Yes" ? 1 : 0,
        Diabetes: data.Diabetes === "Yes" ? 1 : 0,
        Depression: data.Depression === "Yes" ? 1 : 0,
        HeadInjury: data.HeadInjury === "Yes" ? 1 : 0,
        Hypertension: data.Hypertension === "Yes" ? 1 : 0,
        SystolicBP: Number(data.SystolicBP),
        DiastolicBP: Number(data.DiastolicBP),
        CholesterolTotal: Number(data.CholesterolTotal),
        CholesterolLDL: Number(data.CholesterolLDL),
        CholesterolHDL: Number(data.CholesterolHDL),
        CholesterolTriglycerides: Number(data.CholesterolTriglycerides),
        MMSE: Number(data.MMSE),
        FunctionalAssessment: Number(data.FunctionalAssessment),
        MemoryComplaints: data.MemoryComplaints === "Yes" ? 1 : 0,
        BehavioralProblems: data.BehavioralProblems === "Yes" ? 1 : 0,
        ADL: Number(data.ADL),
        Confusion: data.Confusion === "Yes" ? 1 : 0,
        Disorientation: data.Disorientation === "Yes" ? 1 : 0,
        PersonalityChanges: data.PersonalityChanges === "Yes" ? 1 : 0,
        DifficultyCompletingTasks: data.DifficultyCompletingTasks === "Yes" ? 1 : 0,
        Forgetfulness: data.Forgetfulness === "Yes" ? 1 : 0,
      };
    } catch (error) {
      throw new Error("Invalid input format. Please check your entries.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);

    if (Object.values(formData).some((value) => value === "")) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const transformedData = transformFormData(formData);
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction === 1 ? "Alzheimer's likely" : "No Alzheimer's detected");
    } catch (error) {
      console.error("Error during fetch:", error);
      setError(error.message || "Error fetching prediction. Please try again.");
    }
  };

  const RadioGroup = ({ name, label, options, value, onChange }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="radio-group">
        {options.map((option) => (
          <label key={option} className="radio-label">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="radio-input"
              required
            />
            <span className="radio-text">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          .container {
            max-width: 896px;
            margin: 0 auto;
            padding: 24px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .title {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 24px;
            color: #1f2937;
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 32px;
          }

          .section {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 16px;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }

          @media (min-width: 768px) {
            .grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 4px;
          }

          .input,
          .select {
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            color: #1f2937;
          }

          .input:focus,
          .select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }

          .range {
            width: 100%;
            margin-top: 4px;
          }

          .range-value {
            font-size: 14px;
            color: #4b5563;
          }

          .radio-group {
            display: flex;
            gap: 16px;
            margin-top: 4px;
          }

          .radio-label {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #4b5563;
          }

          .radio-input {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            accent-color: #3b82f6;
          }

          .radio-text {
            font-size: 14px;
            color: #4b5563;
          }

          .submit-button {
            padding: 8px 24px;
            background-color: #3b82f6;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .submit-button:hover {
            background-color: #2563eb;
          }

          .submit-button:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
          }

          .prediction {
            margin-top: 24px;
            padding: 16px;
            background-color: #dcfce7;
            color: #166534;
            border-radius: 4px;
            text-align: center;
            font-size: 18px;
            font-weight: 500;
          }

          .error {
            margin-top: 24px;
            padding: 16px;
            background-color: #fee2e2;
            color: #991b1b;
            border-radius: 4px;
            text-align: center;
            font-size: 18px;
            font-weight: 500;
          }
        `}
      </style>

      <div className="container">
        <h1 className="title">Alzheimer's Risk Assessment</h1>
        <form onSubmit={handleSubmit} className="form">
          {/* Demographics */}
          <div className="section">
            <h2 className="section-title">Demographics</h2>
            <div className="grid">
              <div>
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  min="50"
                  max="100"
                  placeholder="e.g., 70"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="form-label">Ethnicity</label>
                <select
                  name="Ethnicity"
                  value={formData.Ethnicity}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Select Ethnicity</option>
                  <option value="Caucasian">Caucasian</option>
                  <option value="African American">African American</option>
                  <option value="Asian">Asian</option>
                  <option value="Hispanic">Hispanic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Education Level</label>
                <select
                  name="EducationLevel"
                  value={formData.EducationLevel}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Select Education</option>
                  <option value="None">None</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Higher">Higher (Master's/PhD)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="section">
            <h2 className="section-title">Lifestyle</h2>
            <div className="grid">
              <div>
                <label className="form-label">BMI (15-40)</label>
                <input
                  type="range"
                  name="BMI"
                  value={formData.BMI}
                  onChange={handleChange}
                  min="15"
                  max="40"
                  step="0.1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.BMI || "Select value"}</span>
              </div>
              <RadioGroup
                name="Smoking"
                label="Smoking"
                options={["Yes", "No"]}
                value={formData.Smoking}
                onChange={handleChange}
              />
              <div>
                <label className="form-label">Alcohol Consumption (0-20 drinks/week)</label>
                <input
                  type="range"
                  name="AlcoholConsumption"
                  value={formData.AlcoholConsumption}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  step="1"
                  className="range"
                  required
                />
                <span class help me continue from here className="range-value">{formData.AlcoholConsumption || "0"} drinks/week</span>
              </div>
              <div>
                <label className="form-label">Physical Activity (0-10 hours/week)</label>
                <input
                  type="range"
                  name="PhysicalActivity"
                  value={formData.PhysicalActivity}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.PhysicalActivity || "0"} hours/week</span>
              </div>
              <div>
                <label className="form-label">Diet Quality (0-10 scale)</label>
                <input
                  type="range"
                  name="DietQuality"
                  value={formData.DietQuality}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.DietQuality || "0"} / 10</span>
              </div>
              <div>
                <label className="form-label">Sleep Quality (0-10 scale)</label>
                <input
                  type="range"
                  name="SleepQuality"
                  value={formData.SleepQuality}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.SleepQuality || "0"} / 10</span>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="section">
            <h2 className="section-title">Medical History</h2>
            <div className="grid">
              <RadioGroup
                name="FamilyHistoryAlzheimers"
                label="Family History of Alzheimer's"
                options={["Yes", "No"]}
                value={formData.FamilyHistoryAlzheimers}
                onChange={handleChange}
              />
              <RadioGroup
                name="CardiovascularDisease"
                label="Cardiovascular Disease"
                options={["Yes", "No"]}
                value={formData.CardiovascularDisease}
                onChange={handleChange}
              />
              <RadioGroup
                name="Diabetes"
                label="Diabetes"
                options={["Yes", "No"]}
                value={formData.Diabetes}
                onChange={handleChange}
              />
              <RadioGroup
                name="Depression"
                label="Depression"
                options={["Yes", "No"]}
                value={formData.Depression}
                onChange={handleChange}
              />
              <RadioGroup
                name="HeadInjury"
                label="History of Head Injury"
                options={["Yes", "No"]}
                value={formData.HeadInjury}
                onChange={handleChange}
              />
              <RadioGroup
                name="Hypertension"
                label="Hypertension"
                options={["Yes", "No"]}
                value={formData.Hypertension}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Vital Signs */}
          <div className="section">
            <h2 className="section-title">Vital Signs</h2>
            <div className="grid">
              <div>
                <label className="form-label">Systolic Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  name="SystolicBP"
                  value={formData.SystolicBP}
                  onChange={handleChange}
                  min="80"
                  max="200"
                  placeholder="e.g., 120"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Diastolic Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  name="DiastolicBP"
                  value={formData.DiastolicBP}
                  onChange={handleChange}
                  min="50"
                  max="120"
                  placeholder="e.g., 80"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Total Cholesterol (mg/dL)</label>
                <input
                  type="range"
                  name="CholesterolTotal"
                  value={formData.CholesterolTotal}
                  onChange={handleChange}
                  min="100"
                  max="300"
                  step="1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.CholesterolTotal || "0"} mg/dL</span>
              </div>
              <div>
                <label className="form-label">LDL Cholesterol (mg/dL)</label>
                <input
                  type="range"
                  name="CholesterolLDL"
                  value={formData.CholesterolLDL}
                  onChange={handleChange}
                  min="50"
                  max="200"
                  step="1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.CholesterolLDL || "0"} mg/dL</span>
              </div>
              <div>
                <label className="form-label">HDL Cholesterol (mg/dL)</label>
                <input
                  type="range"
                  name="CholesterolHDL"
                  value={formData.CholesterolHDL}
                  onChange={handleChange}
                  min="20"
                  max="100"
                  step="1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.CholesterolHDL || "0"} mg/dL</span>
              </div>
              <div>
                <label className="form-label">Triglycerides (mg/dL)</label>
                <input
                  type="range"
                  name="CholesterolTriglycerides"
                  value={formData.CholesterolTriglycerides}
                  onChange={handleChange}
                  min="50"
                  max="400"
                  step="1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.CholesterolTriglycerides || "0"} mg/dL</span>
              </div>
            </div>
          </div>

          {/* Cognitive and Functional Assessment */}
          <div className="section">
            <h2 className="section-title">Cognitive and Functional Assessment</h2>
            <div className="grid">
              <div>
                <label className="form-label">MMSE Score (0-30)</label>
                <input
                  type="range"
                  name="MMSE"
                  value={formData.MMSE}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  step="1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.MMSE || "0"} / 30</span>
              </div>
              <div>
                <label className="form-label">Functional Assessment (0-10)</label>
                <input
                  type="range"
                  name="FunctionalAssessment"
                  value={formData.FunctionalAssessment}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.FunctionalAssessment || "0"} / 10</span>
              </div>
              <div>
                <label className="form-label">Activities of Daily Living (0-10)</label>
                <input
                  type="range"
                  name="ADL"
                  value={formData.ADL}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="range"
                  required
                />
                <span className="range-value">{formData.ADL || "0"} / 10</span>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="section">
            <h2 className="section-title">Symptoms</h2>
            <div className="grid">
              <RadioGroup
                name="MemoryComplaints"
                label="Memory Complaints"
                options={["Yes", "No"]}
                value={formData.MemoryComplaints}
                onChange={handleChange}
              />
              <RadioGroup
                name="BehavioralProblems"
                label="Behavioral Problems"
                options={["Yes", "No"]}
                value={formData.BehavioralProblems}
                onChange={handleChange}
              />
              <RadioGroup
                name="Confusion"
                label="Confusion"
                options={["Yes", "No"]}
                value={formData.Confusion}
                onChange={handleChange}
              />
              <RadioGroup
                name="Disorientation"
                label="Disorientation"
                options={["Yes", "No"]}
                value={formData.Disorientation}
                onChange={handleChange}
              />
              <RadioGroup
                name="PersonalityChanges"
                label="Personality Changes"
                options={["Yes", "No"]}
                value={formData.PersonalityChanges}
                onChange={handleChange}
              />
              <RadioGroup
                name="DifficultyCompletingTasks"
                label="Difficulty Completing Tasks"
                options={["Yes", "No"]}
                value={formData.DifficultyCompletingTasks}
                onChange={handleChange}
              />
              <RadioGroup
                name="Forgetfulness"
                label="Forgetfulness"
                options={["Yes", "No"]}
                value={formData.Forgetfulness}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: "center" }}>
            <button type="submit" className="submit-button">
              Get Prediction
            </button>
          </div>
        </form>

        {/* Prediction and Error Display */}
        {prediction && (
          <div className="prediction">
            <p>Prediction: {prediction}</p>
          </div>
        )}
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default AlzheimersPrediction;