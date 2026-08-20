// AdminLogin.jsx - High Contrast "Apple Pro" Forced Dark Mode
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEye, faEyeSlash, faLock, faShieldHalved, faSpinner } from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) return setError("Please enter your username and password.");
    setIsLoading(true); setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ username: formData.username.trim(), password: formData.password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to sign in.");
      
      if (data.admin) localStorage.setItem("admin_user", JSON.stringify(data.admin));
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🍏 FORCED DARK MODE BACKGROUND: Pure black, explicitly white text
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black px-4 py-8 sm:px-6 text-white font-sans">
      
      {/* Ambient Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px] transform-gpu" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px] transform-gpu" />

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-[420px]">
        
        {/* 🍏 FIXED CARD CONTRAST: Visible border (white/10) and stronger translucent background (white/5) */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
          
          <div className="mb-8">
            <div className="mb-8 flex items-center justify-between">
              <a href="/" className="font-mono text-lg font-bold tracking-tight text-white outline-none transition-opacity hover:opacity-80"><span className="text-indigo-400">&gt;</span> SA.</a>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-indigo-400">
                <FontAwesomeIcon icon={faShieldHalved} className="h-2.5 w-2.5" /> Secure
              </div>
            </div>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <FontAwesomeIcon icon={faLock} className="h-5 w-5" />
            </div>
            <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-indigo-400">Restricted Access</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin login</h1>
          </div>

          {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-400">{error}</motion.div>}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="admin-username" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">Username</label>
              {/* 🍏 FIXED INPUT CONTRAST */}
              <input id="admin-username" name="username" type="text" value={formData.username} onChange={handleChange} autoComplete="username" autoCapitalize="none" spellCheck="false" disabled={isLoading} required 
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all focus:border-indigo-500 focus:bg-white/[0.06] disabled:opacity-50" 
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative">
                <input id="admin-password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} autoComplete="current-password" disabled={isLoading} required 
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pr-12 text-[14px] text-white outline-none transition-all focus:border-indigo-500 focus:bg-white/[0.06] disabled:opacity-50" 
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} disabled={isLoading} className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white outline-none">
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Apple Style Solid White Button */}
            <button type="submit" disabled={isLoading} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[14px] font-bold transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]" style={{ color: "#000000" }} >
              {isLoading ? (
                <><FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" /> Authenticating...</>
              ) : (
                <><FontAwesomeIcon icon={faLock} className="h-3.5 w-3.5" /> Sign In</>
              )}
            </button>
          </form>

          {/* FIXED BACK BUTTON CONTRAST: Now text-gray-400, turns white on hover */}
          <button type="button" onClick={() => navigate("/")} className="mx-auto mt-8 flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-gray-400 transition-colors hover:text-white outline-none">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" /> Back to portfolio
          </button>
        </div>
      </motion.section>
    </main>
  );
}