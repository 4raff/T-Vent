"use client";

import { useState } from "react";
import { authService } from '@/data-layer/authService';

export default function LoginModal({
  onClose,
  onLogin,
  isSignupMode = false,
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(isSignupMode);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    console.log("DEBUG DATA SENT:", { 
        password: password, 
        confirmPassword: confirmPassword, 
        isMatch: password === confirmPassword 
    });
    
    try {
      let response = null;

      if (isSignup) {
        if (password !== confirmPassword) {
          setErrorMessage("Konfirmasi password tidak cocok!");
          setIsLoading(false);
          return;
        }

        response = await authService.register({
          email,
          username,
          password,
          no_handphone: number,
        });

        alert("Registrasi berhasil! Silakan login.");
        setIsSignup(false);
        setErrorMessage(null);

      } else {
        const credentials = { email, password };
        response = await authService.login(credentials);
        
        onLogin(response.token, response.user);
        
        onClose(); 
      }
    } catch (error) {
      
      // 🛑 DEBUGGING: Cetak seluruh objek error untuk melihat property apa yang ada
      console.error("Auth Error: Object Penuh:", error); 
      console.error("Auth Error: Data Backend:", error.response?.data);
      
      // Ambil pesan error dari respons backend atau gunakan pesan default
      const backendMessage = error.response?.data?.message || error.message;

      setErrorMessage(backendMessage || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="relative p-6 border-b border-accent/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-muted rounded-lg transition disabled:opacity-50"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-foreground/60 mt-2">
            {isSignup
              ? "Join us to create and attend amazing events"
              : "Login to access your events"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted disabled:opacity-50"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="08123456789"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted disabled:opacity-50"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted disabled:opacity-50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Toggle Signup */}
        <div className="px-6 pb-6 text-center border-t border-accent/20 pt-4">
          <p className="text-sm text-foreground/60">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              disabled={isLoading}
              className="text-primary font-semibold hover:underline disabled:opacity-50"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}