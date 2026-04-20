"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login: saveUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        setError(
          data.message || "Login failed. Please check your credentials.",
        );
        setIsLoading(false);
        return;
      }
      const userData = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        avatar: data.data.user.avatar,
      };
      saveUser(userData);

      // Successful login - redirect based on role from backend
      const redirectUrl =
        data.data.redirectUrl ||
        (data.data.user.role === "ADMIN" ? "/dashboard" : "/agent-dashboard");

      router.push(redirectUrl);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const DemoUsers = [
    {
      email: "admin@fieldscale.com",
      pwd: "123456",
    },
    {
      email: "sarah.miller@fieldscale.com",
      pwd: "123456",
    },
    {
      email: "mike.kade@fieldscale.com",
      pwd: "123456",
    },
    {
      email: "john.doe@fieldscale.com",
      pwd: "123456",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9ff] flex">
      {/* LEFT SIDE - Green Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#204e2b] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-x-3 mb-8">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
              🌾
            </div>
            <span
              className="text-3xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              FieldScale Pro
            </span>
          </div>

          <h1
            className="text-6xl leading-[1.05] font-semibold tracking-tighter mb-6 text-white"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Advanced Field
            <br />
            Intelligence for
            <br />
            Every Acre.
          </h1>

          <p className="text-xl text-white/80 max-w-md">
            Experience the digital agronomist approach.
            <br />
            High-density data turned into actionable insights for sustainable
            growth.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
            <div
              className="text-4xl font-semibold mb-1 text-white"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              1.2M+
            </div>
            <div className="text-sm uppercase tracking-widest text-white/70">
              ACRES MANAGED
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
            <div
              className="text-4xl font-semibold mb-1 text-white"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              98.4%
            </div>
            <div className="text-sm uppercase tracking-widest text-white/70">
              YIELD ACCURACY
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/1200/1200')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2
              className="text-4xl font-semibold text-[#181c20] mb-2"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Welcome Back
            </h2>
            <p className="text-[#525a4f]">
              Sign in to your agronomist dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Demo Users Quick Login */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#525a4f] mb-3">
                Demo Accounts
              </p>

              <div className="grid grid-cols-1 gap-2">
                {DemoUsers.map((demo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({
                        email: demo.email,
                        password: demo.pwd,
                      });
                    }}
                    className="flex items-center gap-x-4 bg-white hover:bg-[#f7f9ff] border border-[#f1f4fa] hover:border-[#204e2b] p-4 rounded-3xl transition-all group"
                  >
                    {/* Icon - Reused from previous toggle */}
                    <div className="w-10 h-10 flex items-center justify-center text-2xl bg-[#f1f4fa] group-hover:bg-[#204e2b] group-hover:text-white rounded-2xl transition-colors">
                      {index === 0 ? "🛡️" : "👷"}
                    </div>

                    <div className="text-left">
                      <p className="font-medium text-[#181c20]">{demo.email}</p>
                      <p className="text-xs text-[#525a4f]">
                        Password: {demo.pwd}
                      </p>
                    </div>

                    <div className="ml-auto text-[#204e2b] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Use →
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#525a4f] mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@fieldscale.com"
                className="w-full bg-white border border-transparent focus:border-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#525a4f]">
                  PASSWORD
                </label>
                <a href="#" className="text-xs text-[#204e2b] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-transparent focus:border-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#525a4f] hover:text-[#181c20]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#204e2b] hover:bg-[#386641] text-white font-medium py-4 rounded-2xl text-base transition-all disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In to Dashboard →"}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-[#525a4f]">
            New to FieldScale?{" "}
            <a href="#" className="text-[#204e2b] font-medium hover:underline">
              Request access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
