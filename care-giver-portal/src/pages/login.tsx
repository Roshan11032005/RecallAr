

export default function Login() {
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
      `}</style>

      <div className="login-container">
        <div className="login-box">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWE2czdjcDk3emgybGFpazF0bHZqcnQ2bmJmbHZ2bDdkZmZvcW9rNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VbnUQpnihPSIgIXuZv/giphy.gif"
            alt="Login animation"
            className="gif-logo"
          />
          <h2 className="login-title">Welcome Back</h2>
          <form>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
