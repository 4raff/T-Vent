"use client";

import { useState } from "react";
import { authService } from "@/utils/services/authService";

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isSignup) {
        // Register logic
        if (password !== confirmPassword) {
          setFieldErrors({
            confirmPassword: ["Konfirmasi password tidak cocok"]
          });
          setErrorMessage("Validasi gagal");
          setIsLoading(false);
          return;
        }

        await authService.register({
          email,
          username,
          password,
          confirmPassword,
          no_handphone: number,
        });

        setSuccessMessage("Akun berhasil dibuat! Silakan login.");
        
        // Tunggu 1.5 detik biar user lihat success message, baru switch ke login
        // Preserve email dan password untuk auto-fill di login form
        setTimeout(() => {
          setUsername("");
          setNumber("");
          setConfirmPassword("");
          setIsSignup(false);
          setSuccessMessage(null);
          // email dan password tetap terisi untuk login
        }, 1500);
        
      } else {
        // Login logic
        const response = await authService.login({ email, password });
        
        if (response) {
          const userData = response.user || response;
          onLogin(response.token, userData);
          setSuccessMessage("Login berhasil!");
          
          // Close modal setelah login berhasil - kasih waktu 1.5 detik untuk lihat notifikasi
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      console.error("Error data:", error.data);
      console.error("Error data errors:", error.data?.errors);
      if (error.data?.errors) {
        console.error("Errors detail:", JSON.stringify(error.data.errors, null, 2));
      }
      
      // Handle per-field errors - error.data adalah response object
      if (error.data?.errors && Array.isArray(error.data.errors)) {
        const fieldErrorMap = {};
        
        // Group errors by field dan ambil hanya yang pertama
        error.data.errors.forEach((err) => {
          // Skip jika field sudah ada error
          if (!fieldErrorMap[err.field]) {
            fieldErrorMap[err.field] = [err.message];
          }
        });
        
        setFieldErrors(fieldErrorMap);
        // Gunakan message dari backend untuk header alert (Validasi gagal)
        setErrorMessage(error.data.message || "Terjadi kesalahan validasi");
      } else if (error.data?.message) {
        setErrorMessage(error.data.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan. Coba lagi.");
      }
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
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
              ✓ {successMessage}
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
                placeholder="johndoe"
                required={isSignup}
                disabled={isLoading}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition bg-muted disabled:opacity-50 ${
                  fieldErrors.username
                    ? "border-red-500 focus:border-red-500"
                    : "border-accent/20 focus:border-primary"
                }`}
              />
              {fieldErrors.username && (
                <div className="mt-1 text-sm text-red-600">
                  {fieldErrors.username.join(", ")}
                </div>
              )}
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
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition bg-muted disabled:opacity-50 ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-accent/20 focus:border-primary"
              }`}
            />
            {fieldErrors.email && (
              <div className="mt-1 text-sm text-red-600">
                {fieldErrors.email.join(", ")}
              </div>
            )}
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
                required={isSignup}
                disabled={isLoading}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition bg-muted disabled:opacity-50 ${
                  fieldErrors.no_handphone
                    ? "border-red-500 focus:border-red-500"
                    : "border-accent/20 focus:border-primary"
                }`}
              />
              {fieldErrors.no_handphone && (
                <div className="mt-1 text-sm text-red-600">
                  {fieldErrors.no_handphone.join(", ")}
                </div>
              )}
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
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition bg-muted disabled:opacity-50 ${
                fieldErrors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-accent/20 focus:border-primary"
              }`}
            />
            {fieldErrors.password && (
              <div className="mt-1 text-sm text-red-600">
                {fieldErrors.password.join(", ")}
              </div>
            )}
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
                required={isSignup}
                disabled={isLoading}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition bg-muted disabled:opacity-50 ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-accent/20 focus:border-primary"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <div className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmPassword.join(", ")}
                </div>
              )}
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
                Processing...
              </span>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-accent/20 text-center text-sm text-foreground/60">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={isLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={isLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
