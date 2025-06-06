import { Routes, Route } from "react-router-dom";
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import ConfirmForgotPassword from "./ConfirmForgotPassword";
import ActivateAccount from "./ActivateAccount";


const Form = ({ setLoggedIn }) => {


  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-block">
          <Routes>
            <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />

            <Route path="/forgot-password/:token" element={<ConfirmForgotPassword />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/invitation/:token" element={<ActivateAccount />} /> 
            
            <Route path="*" element={<Login setLoggedIn={setLoggedIn} />} />
          </Routes>
        </div>
      </div>
    </section>
  );
};

export default Form;