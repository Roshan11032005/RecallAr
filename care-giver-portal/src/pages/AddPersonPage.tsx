import { useState, type ChangeEvent } from 'react';
import { Upload, Camera } from 'lucide-react';

export default function AddPersonPage() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Here you would handle the submission to your backend
    console.log({ image, name, relationship, notes });
    // Reset form
    setImage(null);
    setName('');
    setRelationship('');
    setNotes('');
    alert('Person added successfully!');
  };

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #f9fafb;
        }

        .page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        .content-card {
          background-color: #1f2937;
          padding: 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 28rem;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          text-align: center;
          color: #f9fafb;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #d1d5db;
          margin-bottom: 0.4rem;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.6rem 0.9rem;
          background-color: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.6rem;
          font-size: 0.95rem;
          color: #f3f4f6;
          transition: border 0.3s, box-shadow 0.3s;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          outline: none;
        }

        .form-textarea {
          resize: none;
          min-height: 6rem;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }

        .submit-button {
          width: 100%;
          background: linear-gradient(to right, #3b82f6, #2563eb);
          color: white;
          padding: 0.7rem 1rem;
          border: none;
          border-radius: 0.6rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .submit-button:active {
          transform: scale(0.98);
        }

        /* Image upload styles */
        .image-upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .image-preview {
          width: 8rem;
          height: 8rem;
          border-radius: 50%;
          background-color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0.75rem;
          border: 2px dashed #4b5563;
          transition: border-color 0.3s, transform 0.3s;
          position: relative;
        }

        .image-preview.has-image {
          border-style: solid;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .upload-button {
          display: flex;
          align-items: center;
          background-color: transparent;
          color: #3b82f6;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
        }

        .upload-button:hover {
          color: #60a5fa;
          background-color: rgba(59, 130, 246, 0.1);
        }

        .upload-icon {
          margin-right: 0.5rem;
        }

        .camera-placeholder {
          color: #6b7280;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .image-preview:hover .camera-placeholder {
          opacity: 1;
        }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shine 2s infinite;
        }

        @keyframes shine {
          100% {
            left: 100%;
          }
        }
      `}</style>
<center>
      <div className="page-container">
        <div className="content-card">
          <h2 className="page-title">Add New Person</h2>

          <div className="image-upload-container">
            <div className={`image-preview ${image ? 'has-image' : ''}`}>
              {image ? (
                <>
                  <img src={image} alt="Person" />
                  <div className="shine-effect"></div>
                </>
              ) : (
                <Camera className="camera-placeholder" size={48} />
              )}
            </div>

            <label className="upload-button">
              <Upload size={16} className="upload-icon" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter person's name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relationship</label>
            <select
              value={relationship}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelationship(e.target.value)}
              className="form-select"
            >
              <option value="">Select Relationship</option>
              <option value="Family Member">Family Member</option>
              <option value="Friend">Friend</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Doctor">Doctor</option>
              <option value="Neighbor">Neighbor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              placeholder="Add helpful details about this person..."
            />
          </div>

          <button onClick={handleSubmit} className="submit-button">
            Save Person
          </button>
        </div>
      </div>
      </center>
    </>
  );
}