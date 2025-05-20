import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";



const ConfirmForgotPassword = ({ setLoggedIn }) => {
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const match = useParams();
  const token = match.token

  const [alert, setAlert] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();


    const inputs = {
      token,
      newPassword1,
      newPassword2
    };


    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/confirm-forgot-password`,
        inputs,
        {
          // headers: {
          // },
        }
      );

      setAlert({
        type: "green",
        message: "Password changed!"
      })

      setNewPassword1("")
      setNewPassword2("")


    } catch (err) {
      console.error(err);

      setAlert({
        type: "red",
        message: "Something went wrong"
      })
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
      <h1>Reset password</h1>

      <form onSubmit={handleSubmit}>
        <div className="inputs-block">
          {
            alert &&
            <div className={`alert-text alert-text-${alert.type}`}>
              {alert.message}
            </div>
          }
          <div>
            <label htmlFor="newpassword1-input">
              New Password
            </label>
            <input
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              type="password"
              id="newpassword1-input"
              required
            />
          </div>
          <div>
            <label htmlFor="newpassword2-input">
              New Password
            </label>
            <input
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              type="password"
              id="newpassword2-input"
              required
            />
          </div>

          <p className="auth-block-info">
            <Link to="/">Log in</Link>
          </p>

          <button type="submit">Confirm</button>
        </div>
      </form>
    </>
  );
};

export default ConfirmForgotPassword;