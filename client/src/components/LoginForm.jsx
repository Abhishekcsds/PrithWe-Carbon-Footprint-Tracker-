


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// function LoginForm({ setLoggedIn }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [type, setType] = useState(""); // Household or Business
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     if (!email || !password || !type) {
//       toast.error("Please fill in email, password, and select user type");
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "/api/auth/login",
//         { email, password, type }, // include user type in request
//         { withCredentials: true }
//       );

//       toast.success(response.data.message || "Login successful!");
//       setLoggedIn(true);
//       navigate("/dashboard"); // Redirect to dashboard after login
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//       setLoggedIn(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         placeholder="Email"
//         autoComplete="email"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         placeholder="Password"
//         autoComplete="current-password"
//       />
//       <select value={type} onChange={e => setType(e.target.value)}>
//         <option value="">Select User Type</option>
//         <option value="Household">Household</option>
//         <option value="Business">Business</option>
//       </select>
//       <button onClick={handleLogin} disabled={loading}>
//         {loading ? "Logging in..." : "Login"}
//       </button>
//     </div>
//   );
// }

// export default LoginForm;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/google.png";


function LoginForm({ setLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/login/status', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.authenticated) {
          // Only call setLoggedIn if it's a function
          if (typeof setLoggedIn === 'function') {
            setLoggedIn(true);
          }
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Login check error:', err);
        toast.error('Failed to check login status');
      }
    };
    
    checkLoginStatus();
  }, [navigate, setLoggedIn]);

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="login m-4 flex justify-center items-center space-x-2 my-16">
      <div className="loginBox flex flex-col bg-gray-200 p-5 md:p-10 space-y-3 rounded-lg justify-center">
        <h1 className="text-center font-medium text-xl md:text-2xl py-4">
          Login with Google
        </h1>
        
        <button
          onClick={handleGoogleLogin}
          className="btn flex items-center justify-center p-2 rounded-full bg-blue-400 hover:bg-blue-600 mt-4"
        >
          <img src={Logo} alt="Google logo" className="w-6 h-6 mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
}

// Add prop type validation
LoginForm.propTypes = {
  // eslint-disable-next-line no-undef
  setLoggedIn: PropTypes.func.isRequired
};

export default LoginForm;