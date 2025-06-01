




// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = location.state?.userId || localStorage.getItem("userId");

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) {
//       navigate("/register");
//     } else {
//       localStorage.setItem("userId", userId);
//     }
//   }, [userId, navigate]);

//   const handleSendOtp = async () => {
//     if (!email) {
//       toast.error("Please enter your email");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/api/auth/send-otp", { userId, email });
//       toast.success(res.data.message || "OTP sent!");
//       setOtpSent(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     if (otp.length !== 6) {
//       toast.error("OTP must be 6 digits");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/api/auth/verify-otp", { userId, otp });
//       toast.success(res.data.message);
//       localStorage.removeItem("userId");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to verify OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="verify-email-container">
//       <ToastContainer autoClose={4000} position="top-center" newestOnTop />
//       <h2 className="text-center font-medium text-xl py-4">Verify Your Email</h2>

//       <div className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg">
//         {!otpSent ? (
//           <>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//               className="rounded-lg px-3 p-2"
//             />
//             <button
//               onClick={handleSendOtp}
//               disabled={loading}
//               className="btn p-2 rounded-full bg-blue-500 hover:bg-blue-600"
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <form onSubmit={handleVerify} className="flex flex-col space-y-4">
//             <input
//               type="text"
//               maxLength={6}
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
//               placeholder="Enter 6-digit OTP"
//               required
//               className="rounded-lg px-3 p-2"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/register");
    } else {
      localStorage.setItem("userId", userId);
      toast.success("OTP sent to your email. Please check.");
    }
  }, [userId, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { userId, otp });
      toast.success(res.data.message || "Email verified successfully!");
      localStorage.removeItem("userId");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <h2 className="text-center font-medium text-xl py-4">Verify Your Email</h2>

      <div className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg">
        <form onSubmit={handleVerify} className="flex flex-col space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            required
            className="rounded-lg px-3 p-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;









