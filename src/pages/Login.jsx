import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sonarLogo from "../imgs/Logo_Sonar_White.png";
import axios from "axios";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_IP}/users/login`,
        {
          email,
          senha,
        }
      );

      if (data?.token) {
        localStorage.setItem(
          "userToken",
          JSON.stringify({ user: data.token.user, token: data.token })
        );
        navigate("/");
      } else {
        setError("Login failed: invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-zinc-900 to-neutral-950">
      <div className="w-full max-w-md select-none p-8 bg-gradient-to-b from-zinc-900 to-neutral-900 rounded-2xl shadow-xl flex flex-col items-center">
        <img src={sonarLogo} alt="Sonar Logo" className="w-[14em]" />

        <h1 className="text-center text-3xl font-bold text-white mb-6">
          One Step Away From <br />
          <span className="text-purple-500">The World Of Music</span>
        </h1>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="sonar@sonar.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus-within:scale-[1.02] focus-within:ring-2 ring-purple-500 transition-all outline-none"
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-white font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={senha}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus-within:ring-2 focus-within:scale-[1.02] ring-purple-500 transition-all outline-none"
              required
            />
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="showPassword"
                className="mr-2"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label htmlFor="showPassword" className="text-white text-sm">
                Show Password
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
            >
              Login
            </button>

            <button
              type="button"
              className="flex-1 bg-purple-600 hover:bg-purple-700 p-1 rounded-lg transition-colors"
            >
              <ArrowRight className="text-white" />
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        <p className="text-white text-sm mt-6">
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-purple-500 hover:underline cursor-pointer"
          >
            Sign-Up
          </a>
        </p>
      </div>
    </div>
  );
}
