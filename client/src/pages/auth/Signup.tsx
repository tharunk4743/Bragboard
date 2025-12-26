import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SignupForm from "../../features/authentication/components/SignupForm";
import Logo from "../../components/Logo";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
            <Logo className="w-20 h-20" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Join the Team</h2>
          <p className="text-slate-500 mt-2 font-medium">
            Create your profile to start recognizing excellence.
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
