import { useState, useEffect } from 'react'
import axios from "axios"
import { setTokens } from "../../utils/token"
import { useNavigate, Link } from "react-router-dom";



const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertText, setAlertText] = useState(null);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();


    const inputs = {
      email,
      password
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/login?fields=email`,
        inputs,
        {
          // headers: {
          // },
        }
      );

      if (response.data.success) {
        setTokens(response.data.tokens)
        setLoggedIn(true)
      }


    } catch (err) {

      if (err.response.data.errors === "") {
        setAlertText("Something went wrong")
      } else {
        setAlertText(err.response.data.errors);
      }
    }
  }


  useEffect(() => {
    if (alertText) {

      setTimeout(() => {
        setAlertText(null)
      }, 4000)
    }
  }, [alertText]);



  return (
    <>
      <h1>Log in</h1>

      <form onSubmit={handleSubmit}>
        <div className="inputs-block">
          {
            alertText &&
            <div className="alert-text">
              {alertText}
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
          <div>
            <label htmlFor="auth-password-input">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="auth-password-input"
              required
            />
          </div>

          <p className="auth-block-info">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

          <button type="submit">Log in</button>
        </div>
      </form>
    </>
  );
};

export default Login;