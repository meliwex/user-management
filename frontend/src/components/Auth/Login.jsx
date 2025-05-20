import { useState, useEffect } from 'react'
import axios from "axios"
import { getRefreshToken, setTokensAndRole } from "../../utils/token"
import { useNavigate, Link } from "react-router-dom";



const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);



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
        setTokensAndRole(response.data.tokens.accessToken, response.data.tokens.refreshToken, response.data.role)
        setLoggedIn(true)
      }


    } catch (err) {

      if (err.response.data.errors === "") {
        setAlert({
          type: "red",
          message: "Something went wrong"
        })

      } else {
        setAlert({
          type: "red",
          message: err.response.data.errors
        })
      }
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
      <h1>Log in</h1>

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