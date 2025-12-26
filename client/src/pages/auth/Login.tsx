import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../features/authentication/components/LoginForm";
import Logo from "../../components/Logo";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // called by LoginForm after successful login
  const handleLoginSuccess = (user: { role: string }) => {
    // backend sends "ADMIN" or "EMPLOYEE"
    if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-indigo-100">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
            <Logo className="w-24 h-24 drop-shadow-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            BragBoard
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Elevating recognition, one shoutout at a time.
          </p>
        </div>

        {/* Pass callback to LoginForm */}
        <LoginForm onLoginSuccess={handleLoginSuccess} />

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Infosys 6.0 internship project Group D Tharun
        </p>
      </div>
    </div>
  );
};

export default Login;
