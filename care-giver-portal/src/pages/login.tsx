import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await fetch('https://3f95-2402-e280-212e-e5-1847-7ad2-f961-6092.ngrok-free.app/web/caregiver/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }

      // Save JWT & user info to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Server error. Please try again.');
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

        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          padding: 1rem;
        }

        .login-box {
          background-color: #1f2937;
          padding: 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 22rem;
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

        .login-title {
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
        
        .signup-link {
          margin-top: 1.5rem;
          display: block;
          color: #d1d5db;
          text-align: center;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .signup-link span {
          color: #3b82f6;
          font-weight: 600;
        }

        .signup-link:hover span {
          text-decoration: underline;
        }
      `}</style>
      <div className="login-container">
        <div className="login-box">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWE2czdjcDk3emgybGFpazF0bHZqcnQ2bmJmbHZ2bDdkZmZvcW9rNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VbnUQpnihPSIgIXuZv/giphy.gif"
            alt="Login animation"
            className="gif-logo"
          />
          <h2 className="login-title">Welcome Back</h2>

          {loginError && <div className="error-message">{loginError}</div>}

          <form onSubmit={handleSubmit}>
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
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <Link to="/signup" className="signup-link">
            Don't have an account? <span>Create One</span>
          </Link>
        </div>
      </div>
    </>
  );
}
