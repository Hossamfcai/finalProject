import {
  Star,
  BadgeCheck,
  KeyRound,
  Drama,
  Info,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import signupImage from "../../../assets/images/signup_image.png";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  sectionVariants,
  sectionVariantsFromTop,
} from "../../../utils/constantsVariants";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Slices/authSlice";
import { showLoginSuccessAlert } from "../../../utils/sweetAlertNotifications";

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "*Full name must be at least 2 characters")
      .max(100, "*Full name must not exceed 100 characters"),

    email: z.string().trim().email("*Please enter a valid email address"),

    password: z
      .string()
      .min(8, "*Password must be at least 8 characters")
      .regex(/[A-Z]/, "*Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "*Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "*Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "*Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "*Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { registerLoading, registerError } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    // confirmPassword is only used for validation
    const { confirmPassword, ...submittedData } = data;
    const submited = { role: role, ...submittedData };
    const result = await dispatch(registerUser(submited));
    if (registerUser.fulfilled.match(result)) {
      navigate("/Authentication/Login", { replace: true });
      showLoginSuccessAlert(
        result.payload.name,
        "Register successful, please login",
      );
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
      <div className="w-full max-w-[1360px] mx-auto px-margin-mobile md:px-margin py-space-md md:py-space-xl drop-shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 relative flex flex-col justify-between p-space-lg md:p-space-xl min-h-[640px] bg-primary text-on-primary overflow-hidden">
            <div
              className="absolute inset-0 w-full h-full  bg-cover bg-center"
              style={{ backgroundImage: `url(${signupImage})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary-container/35  to-primary-container/50" />

            {/* Top Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-pulse" />

                <span className="font-label-sm text-label-sm uppercase tracking-widest text-surface-container-lowest">
                  Curated Access 2025
                </span>
              </div>

              <span className="font-label-md text-label-md text-surface-container-high tracking-widest font-semibold">
                EST. MMXXV
              </span>
            </div>

            {/* Center Content */}
            <div className="relative z-10 my-auto py-8 space-y-6">
              <div className="space-y-3">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline-variant font-semibold">
                  Membership Induction
                </p>

                <h2 className="font-headline-lg text-headline-lg text-surface-container-lowest leading-tight font-semibold">
                  Join a discerning collective of cultural patrons and curators.
                </h2>
              </div>

              <div className="bg-surface-container-lowest/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 space-y-3 shadow-sm">
                {/* Stars */}
                <div className="flex items-center gap-1 text-surface-container-lowest">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>

                <p className="font-body-sm text-body-sm text-surface-container-lowest italic leading-relaxed">
                  “EventVerse provides unparalleled access to intimate
                  vernissages and uncompromising ticketing integrity across 50+
                  global capitals.”
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <p className="font-label-md text-label-md text-surface-container-lowest font-semibold">
                      Elena Rostova
                    </p>

                    <p className="font-label-sm text-label-sm text-surface-container-high">
                      Senior Curatorial Fellow, Berlin
                    </p>
                  </div>

                  <BadgeCheck
                    size={22}
                    className="text-surface-container-high"
                  />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-outline-variant font-label-sm text-label-sm uppercase tracking-wider">
              <div>
                <span className="block text-surface-container-lowest font-headline-sm text-[18px]">
                  10,000+
                </span>

                <span className="text-[10px] text-surface-container-high tracking-widest">
                  Curated Events
                </span>
              </div>

              <div className="h-8 w-[1px] bg-white/20" />

              <div>
                <span className="block text-surface-container-lowest font-headline-sm text-[18px]">
                  50+
                </span>

                <span className="text-[10px] text-surface-container-high tracking-widest">
                  Global Capitals
                </span>
              </div>

              <div className="h-8 w-[1px] bg-white/20" />

              <div>
                <span className="block text-surface-container-lowest font-headline-sm text-[18px]">
                  99.8%
                </span>

                <span className="text-[10px] text-surface-container-high tracking-widest">
                  Turnstile Audit
                </span>
              </div>
            </div>
          </div>

          {/* Right Registration Column */}
          <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg md:p-space-xl flex flex-col justify-between">
            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Registration Dossier</span>
              </div>

              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Create Your Account
              </h1>

              <p className="font-body-md text-body-md text-on-surface-variant">
                Join EventVerse to discover landmark cultural events or create
                and publish your own.
              </p>
            </div>

            {/* Role Switcher - UI Only */}
            <div className="mb-6 p-1.5 bg-surface-container-low rounded-2xl flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container rounded-xl">
                <button
                  onClick={() => {
                    setRole("USER");
                  }}
                  className={`cursor-pointer w-full py-2.5 px-4 rounded-lg font-label-lg text-label-lg text-center transition-all ${role === "USER" ? "bg-primary text-on-primary shadow-sm" : "text-secondary hover:text-on-surface"}  flex items-center justify-center gap-2`}
                  type="button"
                >
                  <KeyRound size={18} />
                  <span>Attendee / Patron</span>
                </button>

                <button
                  onClick={() => {
                    setRole("ORGANIZER");
                  }}
                  className={`cursor-pointer w-full py-2.5 px-4 rounded-lg font-label-lg text-label-lg text-center transition-all ${role == "ORGANIZER" ? "bg-primary text-on-primary shadow-sm" : "text-secondary hover:text-on-surface"}  flex items-center justify-center gap-2`}
                  type="button"
                >
                  <Drama size={18} />
                  <span>Curator / Organizer</span>
                </button>
              </div>

              <div className="px-3 pb-1 flex items-center gap-2 text-secondary">
                <Info size={16} className="text-outline" />

                <span className="font-label-sm text-label-sm">
                  Discover exhibits, reserve passes, and access digital
                  turnstile QR credentials.
                </span>
              </div>
            </div>

            {/* Form UI */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant"
                  htmlFor="reg-fullname"
                >
                  Full Name
                </label>

                <div className="relative">
                  <input
                    {...register("name")}
                    className={`w-full h-12 px-4 pl-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none  transition-all shadow-inner ${
                      errors.name ? "border border-red-500" : ""
                    }`}
                    id="reg-fullname"
                    placeholder="Julian Vance"
                    type="text"
                  />

                  <User
                    size={20}
                    className="absolute left-3.5 top-3 text-outline"
                  />
                </div>

                {errors.name && (
                  <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={sectionVariantsFromTop}
                    className="text-red-500 font-label-sm text-label-sm"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant"
                  htmlFor="reg-email"
                >
                  Email Address
                </label>

                <div className="relative">
                  <input
                    {...register("email")}
                    className={`w-full h-12 px-4 pl-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none  transition-all shadow-inner ${
                      errors.email ? "border border-red-500" : ""
                    }`}
                    id="reg-email"
                    placeholder="julian.vance@vance-atelier.com"
                    type="email"
                  />

                  <Mail
                    size={20}
                    className="absolute left-3.5 top-3 text-outline"
                  />
                </div>

                {errors.email && (
                  <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={sectionVariantsFromTop}
                    className="text-red-500 font-label-sm text-label-sm"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant"
                  htmlFor="reg-password"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    {...register("password")}
                    className={`w-full h-12 px-4 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none  transition-all shadow-inner ${
                      errors.password ? "border border-red-500" : ""
                    }`}
                    id="reg-password"
                    placeholder="Minimum 8 characters"
                    type={!showPassword ? "password" : "text"}
                  />

                  <Lock
                    size={20}
                    className="absolute left-3.5 top-3 text-outline"
                  />

                  <button
                    className="absolute right-3.5 top-3 text-outline hover:text-on-surface"
                    type="button"
                    onClick={() => {
                      setShowPassword((prev) => {
                        return !prev;
                      });
                    }}
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
                    className="text-red-500 font-label-sm text-label-sm"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant"
                  htmlFor="reg-confirm"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    className={`w-full h-12 px-4 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none  transition-all shadow-inner ${
                      errors.confirmPassword ? "border border-red-500" : ""
                    }`}
                    id="reg-confirm"
                    placeholder="Re-enter password"
                    type={!showConfirmPassword ? "password" : "text"}
                  />

                  <Lock
                    size={20}
                    className="absolute left-3.5 top-3 text-outline"
                  />

                  <button
                    className="absolute right-3.5 top-3 text-outline hover:text-on-surface"
                    type="button"
                    onClick={() => {
                      setShowConfirmPassword((prev) => {
                        return !prev;
                      });
                    }}
                  >
                    {showConfirmPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={sectionVariantsFromTop}
                    className="text-red-500 font-label-sm text-label-sm"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>
              {registerError && (
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
                      {registerError}
                    </span>
                    <span className="font-body-sm text-[13px] text-on-surface-variant leading-tight">
                      {registerError.includes("server")
                        ? "Please check your network and try again."
                        : "You can create a new account by another Email"}
                    </span>
                  </div>
                </motion.div>
              )}
              {/* Submit */}
              <button
                className="cursor-pointer w-full h-12 mt-2 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                type="submit"
                disabled={registerLoading}
              >
                {!registerLoading && (
                  <>
                    <span>Create EventVerse Account</span>
                    <ArrowRight size={18} />
                  </>
                )}{" "}
                {registerLoading && (
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={sectionVariantsFromTop}
                    className="w-5 h-5 border-4 border-on-surface-variant border-t-on-primary rounded-full animate-spin"
                  ></motion.div>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="font-body-sm text-body-sm text-secondary">
                Already have an account?
                <a
                  className="cursor-pointer font-label-lg text-label-lg text-on-surface hover:underline ml-1 font-semibold"
                  onClick={() => {
                    navigate("/Authentication/Login");
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
