import {
  Mail,
  KeyRound,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sectionVariants,
  sectionVariantsFromTop,
} from "../../../utils/constantsVariants";
import loginImage from "../../../assets/images/login_image.png";
import { loginUser } from "../Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { showLoginSuccessAlert } from "../../../utils/sweetAlertNotifications";
const loginSchema = z.object({
  email: z.string().trim().email("*Please enter a valid email address"),

  password: z
    .string()
    .min(1, "*Password is required")
    .min(8, "*Password must be at least 8 characters"),
});
export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (body) => {
    const result = await dispatch(loginUser(body));
    // navigate only if the thunk succeeded
    if (loginUser.fulfilled.match(result)) {
      if (result.payload.role.toLowerCase() === "user") {
        navigate("/AttendeeDashboard");
      } else {
        navigate("/OrganizerDashboard");
      }
      showLoginSuccessAlert(result.payload.name, "Login successful");
    }
  };
  return (
    <motion.div
      className="flex flex-col w-full pt-20 drop-shadow-3xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="max-w-[1360px] mx-auto w-full px-margin-mobile md:px-margin py-space-xl drop-shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest">
          {/* Left Column / Curated Photographic Experience Panel */}
          <div className="lg:col-span-6 relative flex flex-col justify-between p-space-lg md:p-space-xl min-h-[640px] bg-primary text-on-primary overflow-hidden">
            <div
              className="absolute inset-0 w-full h-full  bg-cover bg-center"
              style={{ backgroundImage: `url(${loginImage})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary-container/35  to-primary-container/50" />

            {/* Top Tag & Security Stamp */}
            <div className="relative z-10 flex items-center justify-between gap-space-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-surface">
                  Patron Circle Verification
                </span>
              </div>

              <div className="font-label-sm text-label-sm tracking-widest uppercase text-outline-variant">
                EST. MMXXV
              </div>
            </div>

            {/* Center Atmospheric Quote */}
            <div className="relative z-10 my-auto py-space-xl max-w-md">
              <div className="w-8 h-[2px] bg-surface-variant mb-space-md opacity-60" />

              <p className="font-headline-md text-headline-md tracking-tight leading-relaxed text-surface mb-space-md">
                “Access premier cultural exhibitions, private vernissages, and
                acoustically tuned live showcases worldwide.”
              </p>

              <span className="font-label-md text-label-md text-secondary-fixed tracking-wide uppercase">
                Curatorial Registry — Tier I Global Privileges
              </span>
            </div>

            {/* Bottom Curatorial Metrics */}
            <div className="relative z-10 pt-space-md  -mx-space-lg md:-mx-space-xl -mb-space-lg md:-mb-space-xl p-space-lg md:p-space-xl">
              <div className="grid grid-cols-2 gap-space-lg">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline-lg text-headline-lg tracking-tight text-surface">
                      10,000
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary-fixed">
                      +
                    </span>
                  </div>

                  <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed mt-1">
                    Curated Events
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline-lg text-headline-lg tracking-tight text-surface">
                      50
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary-fixed">
                      +
                    </span>
                  </div>

                  <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed mt-1">
                    Global Capitals
                  </p>
                </div>
              </div>

              {/* Micro Sparkline */}
              <div className="mt-space-md pt-space-sm flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase text-outline-variant tracking-wider">
                  Pass Capacity Index
                </span>

                <svg
                  className="w-32 h-6 text-primary-fixed"
                  fill="none"
                  viewBox="0 0 128 24"
                >
                  <path
                    d="M0 18 L16 16 L32 19 L48 10 L64 14 L80 6 L96 9 L112 3 L128 7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />

                  <circle cx="128" cy="7" fill="currentColor" r="2.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column / Patron Sign In */}
          <div className=" lg:col-span-6 bg-surface-container-lowest p-space-lg md:p-space-xl flex flex-col justify-between">
            <div className="max-w-md w-full mx-auto my-auto py-space-sm">
              {/* Editorial Form Header */}
              <div className="mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">
                  Member Authentication
                </span>

                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Welcome Back
                </h1>

                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Enter your verified patron or organizer credentials to manage
                  your passes and reservations.
                </p>
              </div>

              {/* Authentication Form - UI ONLY */}
              <form
                className="space-y-space-md"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    className="block font-label-md text-label-md text-on-surface"
                    htmlFor="patronEmail"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                    />

                    <input
                      {...register("email")}
                      className={`w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none  transition-all ${
                        errors.email ? "ring-1 ring-error" : ""
                      }`}
                      id="patronEmail"
                      placeholder="elena.rostova@atelier.com"
                      type="email"
                    />
                  </div>

                  {errors.email && (
                    <motion.p
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.15 }}
                      variants={sectionVariantsFromTop}
                      className="text-sm text-error"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="block font-label-md text-label-md text-on-surface"
                      htmlFor="patronPassword"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <KeyRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                    />

                    <input
                      {...register("password")}
                      className={`w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none  transition-all ${
                        errors.password ? "ring-1 ring-error" : ""
                      }`}
                      id="patronPassword"
                      placeholder="••••••••••••"
                      type={showPassword ? "text" : "password"}
                    />

                    <button
                      className="absolute right-3.5 top-3 text-outline hover:text-on-surface"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>

                  {errors.password && (
                    <motion.p
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.15 }}
                      variants={sectionVariantsFromTop}
                      className="text-sm text-error"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>
                {error && (
                  <motion.div
                    className="flex items-center gap-3 p-3.5 px-4 rounded-xl bg-error-container/40 text-on-error-container border border-error/20"
                    role="alert"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={sectionVariantsFromTop}
                  >
                    <AlertCircle />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-error font-semibold">
                        {error}
                      </span>
                      <span className="font-body-sm text-[13px] text-on-surface-variant leading-tight">
                        {`Please check your ${error.includes("server") ? "network" : "credentials"} and try again.`}
                      </span>
                    </div>
                  </motion.div>
                )}
                {/* Submit */}
                <button
                  className="group cursor-pointer w-full py-3.5 px-6 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.99] transition-all duration-150 shadow-md"
                  type="submit"
                  disabled={loading}
                >
                  {!loading && <span>Sign In to EventVerse</span>}
                  {loading && (
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.15 }}
                      variants={sectionVariantsFromTop}
                      className="w-5 h-5 border-4 border-on-surface-variant border-t-on-primary rounded-full animate-spin"
                    ></motion.div>
                  )}
                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Account Switcher */}
              <div className="text-center mt-space-md pt-space-sm">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  New to EventVerse?
                  <a
                    className="cursor-pointer font-label-md text-label-md text-on-surface underline underline-offset-4 hover:text-secondary transition-colors ml-1"
                    onClick={() => {
                      navigate("/Authentication/Resgistration");
                    }}
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>

            {/* Editorial Accreditation */}
            <div className="mt-space-md pt-space-sm text-center">
              <div className="inline-flex items-center gap-2 text-secondary font-label-sm text-label-sm">
                <Lock size={14} />

                <span>
                  Encrypted patron gateway · 256-bit TLS cryptographically
                  signed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
