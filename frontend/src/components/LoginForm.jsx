import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LogIn, UserPlus, Mail, Lock, User, Truck, Eye, EyeOff } from 'lucide-react';
import axios from "axios";
import { useEffect } from 'react';
import API from "../api";

// useEffect(
//   // call via axios input backend url
//   parameters send like email and password
  
//   ,[])

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const { login, signup } = useData();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   let result;
  //   if (isSignup) {
  //     result = await signup(formData.name, formData.email, formData.password);
  //   } else {
  //     result = await login(formData.email, formData.password);
  //   }
    
  //   if (!result.success) {
  //     setError(result.message);
  //   }
    
  //   setIsLoading(false);
  // };


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    let res;

    if (isSignup) {
      res = await API.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } else {
      res = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
    }

    localStorage.setItem("token", res.data.token);
    alert(isSignup ? "Signup successful 🎉" : "Login successful 🚀");
  } catch (err) {
    console.error("Auth error:", err);
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError('');

//   try {
//     let res;

//     if (isSignup) {
//       res = await axios.post(`${API_URL}/auth/signup`, {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password
//       });
//     } else {
//       res = await axios.post(`${API_URL}/auth/login`, {
//         email: formData.email,
//         password: formData.password
//       });
//     }

//     // Save JWT token
//     localStorage.setItem("token", res.data.token);

//     alert(isSignup ? "Signup successful 🎉" : "Login successful 🚀");
//   } catch (err) {
//     console.error("Auth error:", err);
//     setError(err.response?.data?.message || "Something went wrong");
//   } finally {
//     setIsLoading(false);
//   }
// };


  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Truck Icons */}
      <div className="absolute top-20 left-20 text-white/20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Truck size={32} />
      </div>
      <div className="absolute bottom-20 right-20 text-white/20 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <Truck size={24} />
      </div>
      <div className="absolute top-1/3 right-1/4 text-white/20 animate-bounce" style={{ animationDelay: '2.5s' }}>
        <Truck size={28} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8 slide-up">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
            <Truck size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            GreenCart Logistics
          </h1>
          <p className="text-white/80 text-lg font-medium">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-white/50 to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Toggle Buttons */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !isSignup 
                  ? 'bg-white text-emerald-600 shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() =>  setIsSignup(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isSignup 
                  ? 'bg-white text-emerald-600 shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-100 text-sm backdrop-blur-sm slide-up">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              </div>
            )}

            {isSignup && (
              <div className="form-group slide-up" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="name" className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your full name"
                  required={isSignup}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="form-group slide-up" style={{ animationDelay: isSignup ? '0.2s' : '0.1s' }}>
              <label htmlFor="email" className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group slide-up" style={{ animationDelay: isSignup ? '0.3s' : '0.2s' }}>
              <label htmlFor="password" className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isSignup && (
                <p className="text-white/60 text-xs mt-2">
                  Password must contain uppercase, lowercase, and number
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-gradient-to-r from-white to-white/90 text-emerald-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
              } slide-up`}
              style={{ animationDelay: isSignup ? '0.4s' : '0.3s' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials - Only show for login */}
          {/* {!isSignup && (
            <div className="mt-8 p-4 rounded-2xl bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="font-semibold text-blue-100 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Demo Credentials
              </h3>
              <div className="text-sm text-blue-100/80 space-y-2">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-mono bg-blue-500/20 px-2 py-1 rounded">admin@greencart.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="font-mono bg-blue-500/20 px-2 py-1 rounded">admin123</span>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 slide-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm">
            © 2024 GreenCart Logistics. Delivering a greener future.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <span className="text-xs">Eco-Friendly • Efficient • Reliable</span>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;