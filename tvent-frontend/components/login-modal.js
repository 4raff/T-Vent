"use client";

import { useState } from "react";

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isSignup) {
      // basic validation
      if (!username.trim()) return setError("Username is required");
      if (!email.trim()) return setError("Email is required");
      if (!phone.trim()) return setError("Phone number is required");
      if (!password) return setError("Password is required");
      if (password !== confirmPassword) return setError("Passwords do not match");

      const user = { username: username.trim(), email: email.trim(), phone: phone.trim() };
      onLogin && onLogin(user);
      // clear
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setIsSignup(false);
      return;
    }

    if (email) {
      onLogin && onLogin(email);
      setEmail("");
      setPassword("");
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
              className="p-2 hover:bg-muted rounded-lg transition"
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
          {error && <div className="text-sm text-red-600">{error}</div>}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
              />
            </div>
          )}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">No HP</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812xxxx"
                required
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
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
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
            />
          </div>

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
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-lg focus:outline-none focus:border-primary transition bg-muted"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        {/* Toggle Signup */}
        <div className="px-6 pb-6 text-center border-t border-accent/20 pt-4">
          <p className="text-sm text-foreground/60">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
