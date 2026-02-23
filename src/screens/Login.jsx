
// // // import { useState } from "react";
// // // import { useNavigate } from "react-router-dom";


// // // export default function Login() {
// // //   const [username, setUsername] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const navigate = useNavigate();


// // //   const handleLogin = (e) => {
// // //     e.preventDefault();

// // //     if (!username || !password) {
// // //       alert("Username aur Password dono required hai");
// // //       return;
// // //     }

// // //     // alert("Login successful (dummy)");
// // //       navigate("/dashboard");
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-slate-100">
// // //       {/* Card */}
// // //       <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-10">
// // //         {/* Header */}
// // //         <div className="text-center mb-8">
// // //           <h1 className="text-2xl font-bold text-blue-900">
// // //             Constitution Club of India
// // //           </h1>
// // //           <p className="mt-2 text-sm text-gray-600">
// // //             Admin & Reception Management System
// // //           </p>
// // //         </div>

// // //         {/* Form */}
// // //         <form onSubmit={handleLogin} className="space-y-5">
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //               Username
// // //             </label>
// // //             <input
// // //               type="text"
// // //               placeholder="Enter username"
// // //               value={username}
// // //               onChange={(e) => setUsername(e.target.value)}
// // //               className="w-full rounded-md border border-gray-300 px-3 py-2
// // //                          focus:outline-none focus:ring-2 focus:ring-blue-700
// // //                          focus:border-blue-700"
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //               Password
// // //             </label>
// // //             <input
// // //               type="password"
// // //               placeholder="Enter password"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               className="w-full rounded-md border border-gray-300 px-3 py-2
// // //                          focus:outline-none focus:ring-2 focus:ring-blue-700
// // //                          focus:border-blue-700"
// // //             />
// // //           </div>

// // //           <button
// // //             type="submit"
// // //             className="w-full bg-blue-800 hover:bg-blue-900
// // //                        text-white font-semibold py-2.5 rounded-md
// // //                        transition"
// // //           >
// // //             Login
// // //           </button>
// // //         </form>

// // //         {/* Footer */}
// // //         <p className="mt-8 text-center text-xs text-gray-500">
// // //           Authorized personnel only • © Constitution Club of India
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { loginService } from "../services/authServices";

// // export default function Login() {
// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();

// //     if (!username || !password) {
// //       alert("Username aur Password dono required hai");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       await loginService({
// //         username,
// //         password,
// //       });

// //       // ✅ success
// //       navigate("/dashboard");
// //     } catch (error) {
// //       console.error(error);

// //       // ❌ error message backend se
// //       alert(
// //         error?.response?.data?.message ||
// //           "Login failed, please check credentials"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-slate-100">
// //       {/* Card */}
// //       <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-10">
// //         {/* Header */}
// //         <div className="text-center mb-8">
// //           <h1 className="text-2xl font-bold text-blue-900">
// //             Constitution Club of India
// //           </h1>
// //           <p className="mt-2 text-sm text-gray-600">
// //             Admin & Reception Management System
// //           </p>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleLogin} className="space-y-5">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Username
// //             </label>
// //             <input
// //               type="text"
// //               placeholder="Enter username"
// //               value={username}
// //               onChange={(e) => setUsername(e.target.value)}
// //               className="w-full rounded-md border border-gray-300 px-3 py-2
// //                          focus:outline-none focus:ring-2 focus:ring-blue-700
// //                          focus:border-blue-700"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               placeholder="Enter password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="w-full rounded-md border border-gray-300 px-3 py-2
// //                          focus:outline-none focus:ring-2 focus:ring-blue-700
// //                          focus:border-blue-700"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className={`w-full text-white font-semibold py-2.5 rounded-md transition
// //               ${
// //                 loading
// //                   ? "bg-blue-400 cursor-not-allowed"
// //                   : "bg-blue-800 hover:bg-blue-900"
// //               }`}
// //           >
// //             {loading ? "Logging in..." : "Login"}
// //           </button>
// //         </form>

// //         {/* Footer */}
// //         <p className="mt-8 text-center text-xs text-gray-500">
// //           Authorized personnel only • © Constitution Club of India
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginService } from "../services/authServices";
// import { 
//   Building2, 
//   Lock, 
//   User, 
//   Eye, 
//   EyeOff,
//   ShieldCheck,
//   Smartphone,
//   Mail
// } from "lucide-react";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!username || !password) {
//       alert("Username aur Password dono required hai");
//       return;
//     }

//     try {
//       setLoading(true);
//       await loginService({ username, password });
//       navigate("/dashboard");
//     } catch (error) {
//       console.error(error);
//       alert(
//         error?.response?.data?.message ||
//           "Login failed, please check credentials"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-slate-50">
//       {/* Left Side - Brand & Info */}
//       <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
//         <div className="flex items-center space-x-3">
//           <div className="p-3 bg-white/20 rounded-xl">
//             <Building2 className="w-8 h-8" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">Constitution Club</h1>
//             <p className="text-blue-200 text-sm">Of India</p>
//           </div>
//         </div>

//         <div className="space-y-8 max-w-lg">
//           <div>
//             <h2 className="text-3xl font-bold mb-4">
//               Premier Administrative Portal
//             </h2>
//             <p className="text-blue-100 leading-relaxed">
//               Secure access to the comprehensive management system for 
//               bookings, staff coordination, and operational analytics.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="flex items-start space-x-3">
//               <div className="p-2 bg-white/10 rounded-lg">
//                 <ShieldCheck className="w-5 h-5" />
//               </div>
//               <div>
//                 <h4 className="font-semibold">Bank-Grade Security</h4>
//                 <p className="text-sm text-blue-200">AES-256 Encryption</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <div className="p-2 bg-white/10 rounded-lg">
//                 <Smartphone className="w-5 h-5" />
//               </div>
//               <div>
//                 <h4 className="font-semibold">24/7 Access</h4>
//                 <p className="text-sm text-blue-200">Multi-device Support</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/10 p-6 rounded-2xl">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
//                 <Mail className="w-6 h-6" />
//               </div>
//               <div>
//                 <h4 className="font-semibold">Need Assistance?</h4>
//                 <p className="text-blue-200 text-sm">admin@constitutionclub.org</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="text-sm text-blue-200">
//           <p>© {new Date().getFullYear()} Constitution Club of India. All rights reserved.</p>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
//         <div className="max-w-md mx-auto w-full">
//           {/* Mobile Header */}
//           <div className="lg:hidden mb-10">
//             <div className="flex items-center justify-center space-x-3 mb-4">
//               <div className="p-3 bg-blue-100 rounded-xl">
//                 <Building2 className="w-8 h-8 text-blue-700" />
//               </div>
//               <div className="text-center">
//                 <h1 className="text-2xl font-bold text-blue-900">Constitution Club</h1>
//                 <p className="text-gray-600">Of India</p>
//               </div>
//             </div>
//           </div>

//           {/* Form Container */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
//             <div className="mb-10">
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Welcome Back
//               </h2>
//               <p className="text-gray-600">
//                 Enter your credentials to access the management system
//               </p>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Username Field */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                     <User className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="admin.username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 
//                              focus:border-blue-500 focus:ring-4 focus:ring-blue-100
//                              transition-all duration-200 bg-gray-50"
//                     autoComplete="username"
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     Password
//                   </label>
//                   <a 
//                     href="#" 
//                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Forgot Password?
//                   </a>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                     <Lock className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-300 
//                              focus:border-blue-500 focus:ring-4 focus:ring-blue-100
//                              transition-all duration-200 bg-gray-50"
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Submit */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
//                     Remember this device
//                   </label>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-4 rounded-xl font-semibold text-white
//                   transition-all duration-300 transform hover:scale-[1.02]
//                   ${loading 
//                     ? "bg-blue-400 cursor-not-allowed" 
//                     : "bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700"
//                   } shadow-lg hover:shadow-xl active:scale-[0.99]`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                     </svg>
//                     Authenticating...
//                   </span>
//                 ) : (
//                   "Access Dashboard"
//                 )}
//               </button>

//               {/* Divider */}
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500">
//                     Alternative Access
//                   </span>
//                 </div>
//               </div>

//               {/* Quick Action */}
//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-4">
//                   Using mobile authenticator?
//                 </p>
//                 <button
//                   type="button"
//                   className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl
//                            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
//                            transition-colors duration-200"
//                 >
//                   <ShieldCheck className="w-4 h-4 mr-2" />
//                   Use 2FA Code Instead
//                 </button>
//               </div>
//             </form>

//             {/* Footer */}
//             <div className="mt-10 pt-6 border-t border-gray-100">
//               <div className="text-center">
//                 <p className="text-xs text-gray-500">
//                   <span className="font-medium">Security Notice:</span> 
//                   {" "}Your login activity is monitored and logged for security purposes.
//                   Unauthorized access is prohibited.
//                 </p>
//                 <p className="mt-2 text-xs text-gray-400">
//                   Version 2.1.4 • Last updated: Dec 2023
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/authServices";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle,
  Building2 // Fallback if logo fails
} from "lucide-react";
import logo from "../assets/logo-india.png"; // Importing the logo

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username aur Password dono required hai");
      return;
    }

    try {
      setLoading(true);
      await loginService({ username, password });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
        "Login failed, please check credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Left Side - Brand & Info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-emerald-600 shadow-2xl z-10">

        {/* Abstract Shapes/Tricolor Feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-white blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-800 blur-[100px]"></div>
        </div>

        <div className="relative z-20 text-center max-w-lg mx-auto">
          {/* Main Logo - Much Larger */}
          <div className="mb-12 inline-block p-8 bg-white rounded-[3rem] shadow-2xl">
            <img src={logo} alt="Constitution Club Logo" className="w-48 h-48 object-contain" />
          </div>

          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
            Constitution Club <br />
            <span className="text-orange-100 text-2xl font-bold uppercase tracking-[0.2em] mt-3 block">Of India</span>
          </h1>

          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-300 via-white to-emerald-300 mx-auto rounded-full mb-10 shadow-lg"></div>

          <p className="text-xl text-white font-medium leading-relaxed mb-12 drop-shadow-md opacity-95">
            The Centralized Digital Hub for <br /> Elite Club Management & Administration
          </p>

          {/* Feature Badges - Tricolor accents */}
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-6 py-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full border border-orange-200/30 backdrop-blur-md text-sm text-white font-bold flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-orange-200" /> Secure Portal
            </div>
            <div className="px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 backdrop-blur-md text-sm text-white font-bold flex items-center gap-2 shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" /> Live Analytics
            </div>
            <div className="px-6 py-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full border border-emerald-200/30 backdrop-blur-md text-sm text-white font-bold flex items-center gap-2 shadow-lg">
              <Clock className="w-4 h-4 text-emerald-200" /> 24/7 Access
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="absolute bottom-8 text-xs text-white/60 uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} Official Management Portal
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-white relative">
        {/* Decorative background elements for right side */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-md mx-auto w-full relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden mb-10 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100">
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900 leading-none">Constitution Club</h1>
                <p className="text-sm font-medium text-orange-600">Of India</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:p-10 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                  Admin Portal
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm">
                Please enter your credentials to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors">
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                             transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 text-gray-900
                             placeholder-gray-400 font-medium"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-semibold text-gray-800">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                             transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 text-gray-900
                             placeholder-gray-400 font-medium"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 
                           border-gray-300 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer font-medium">
                  Remember me for 30 days
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-base
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
                  } active:scale-[0.99] flex items-center justify-center space-x-2`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ShieldCheck className="w-5 h-5 opacity-90" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Secure SSL Connection</span>
                </div>
                <p className="text-xs text-gray-400">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}