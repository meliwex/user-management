import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";



const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();


    const inputs = {
      email,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/forgot-password`,
        inputs,
        {
          // headers: {
          // },
        }
      );


      setAlert({ 
        type: "green", 
        message: "Email is sent"
      })


    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    if (alert) {

      setTimeout(() => {
        setAlert(null)
      }, 4000)
    }
  }, [alert]);



  return (
    <>
      <h1>Forgot Password</h1>

      <form onSubmit={handleSubmit}>
        <div className="inputs-block">
          {
            alert &&
            <div className={`alert-text alert-text-${alert.type}`}>
              {alert.message}
            </div>
          }
          <div>
            <label htmlFor="auth-email-input">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="auth-email-input"
              required
            />
          </div>

          <p className="auth-block-info">
            <Link to="/">Log in</Link>
          </p>

          <button type="submit">Send email link</button>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;