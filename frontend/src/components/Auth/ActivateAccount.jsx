import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import DefaultAvatar from "../../assets/default-avatar.jpg"



const ActivateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");


  const [profileImg, setProfileImg] = useState(null);
  const [profileImgForDisplay, setProfileImgForDisplay] = useState(DefaultAvatar);


  const match = useParams();
  const token = match.token

  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();



  const handleImgDisplay = (file) => {
    setProfileImgForDisplay(URL.createObjectURL(file))
    setProfileImg(file)
  }




  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      const inputs = {
        token,
        firstName,
        lastName,
        phone,
        password
      };


      const response1 = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/activate-account`,
        inputs,
        {
          // headers: {
          // },
        }
      );




      const form = new FormData();

      form.append("token", token);


      if (profileImg) {
        form.append("image", profileImg);

      } else {
        const res = await fetch(DefaultAvatar);
        const blob = await res.blob();

        const file = new File([blob], "default-avatar.jpg", {
          type: blob.type,
        });

        form.append("image", file);
      }



      const response2 = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/photos`,
        form,
        {
          // headers: {
          // },
        }
      );


      setAlert({
        type: "green",
        message: "Account is activated!"
      })

      setTimeout(() => {
        navigate("/");
      }, 4000)


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
      <h1>Activate Account</h1>

      <form encType="multipart/form-data" onSubmit={handleSubmit} className="activate-account-form">
        <div className="inputs-block-left inputs-block">
          {
            alert &&
            <div className={`alert-text alert-text-${alert.type}`}>
              {alert.message}
            </div>
          }
          <div>
            <label htmlFor="auth-firstname-input">
              First name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              id="auth-firstname-input"
              required
            />
          </div>
          <div>
            <label htmlFor="auth-lastname-input">
              Last name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              id="auth-lastname-input"
              required
            />
          </div>
          <div>
            <label htmlFor="auth-phone-input">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              id="auth-phone-input"
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

          <button type="submit">Activate</button>
        </div>

        <div className="inputs-block-right">
          <div>
            <label htmlFor="auth-file-input">
              <div className="button">
                Upload image
              </div>
            </label>
            <input
              type="file"
              id="auth-file-input"
              onChange={(e) => handleImgDisplay(e.target.files[0])}
            // required
            />
          </div>
          <img src={profileImgForDisplay} className="profile-image" alt="Default Profile Image" />
        </div>
      </form>
    </>
  );
};

export default ActivateAccount;