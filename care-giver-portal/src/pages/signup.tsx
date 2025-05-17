import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (signupError) setSignupError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSignupError('');

    try {
      const response = await fetch('https://3f95-2402-e280-212e-e5-1847-7ad2-f961-6092.ngrok-free.app/web/caregiver/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'caregiver');
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);

      navigate('/caregiver-dashboard');
    } catch (error: any) {
      setSignupError(error.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
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

        .signup-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100vw;
          padding: 2rem 1rem;
        }

        .signup-box {
          background-color: #1f2937;
          padding: 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 28rem;
          animation: fadeIn 0.6s ease-out;
          text-align: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gif-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          object-fit: cover;
        }

        .signup-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f9fafb;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
          text-align: left;
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #d1d5db;
          margin-bottom: 0.4rem;
        }

        .form-input {
          width: 100%;
          padding: 0.6rem 0.9rem;
          background-color: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.6rem;
          font-size: 0.95rem;
          color: #f3f4f6;
          transition: border 0.3s, box-shadow 0.3s;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          outline: none;
        }

        .form-input.error {
          border-color: #ef4444;
          background-color: rgba(239, 68, 68, 0.05);
        }

        .error-text {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          text-align: center;
        }

        .submit-button {
          width: 100%;
          background-color: #3b82f6;
          color: white;
          padding: 0.7rem 1rem;
          border: none;
          border-radius: 0.6rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          margin-top: 0.5rem;
        }

        .submit-button:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
        }

        .submit-button:active {
          transform: scale(0.98);
        }

        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
          transform: none;
        }

        .password-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #d1d5db;
          cursor: pointer;
        }

        .login-link {
          margin-top: 1.5rem;
          display: block;
          color: #d1d5db;
          text-align: center;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .login-link span {
          color: #3b82f6;
          font-weight: 600;
        }

        .login-link:hover span {
          text-decoration: underline;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-group {
          flex: 1;
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-box">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWE2czdjcDk3emgybGFpazF0bHZqcnQ2bmJmbHZ2bDdkZmZvcW9rNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VbnUQpnihPSIgIXuZv/giphy.gif"
            alt="Login animation"
            className="gif-logo"
          />
          <h2 className="signup-title">Create Account</h2>
          {signupError && <div className="error-message">{signupError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="(123) 456-7890"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <Link to="/login" className="login-link">
            Already have an account? <span>Sign In</span>
          </Link>
        </div>
      </div>
    </>
  );
}
