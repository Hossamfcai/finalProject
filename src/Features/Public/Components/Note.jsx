import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sectionVariants } from "../../../utils/constantsVariants";
export default function Note() {
  const navigate = useNavigate();
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className="w-full bg-background border-b border-outline-variant/30 py-space-md"
    >
      <div className="max-w-[1360px] mx-auto px-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-surface flex-shrink-0">
              <Ticket />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface font-semibold">
                Account required for ticket reservations
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Sign in or create an account to reserve tickets and access your
                digital pass.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
            <a
              onClick={() => {
                navigate("/Authentication/Login");
              }}
              data-path="log-in"
              className="cursor-pointer font-label-md text-label-md text-on-surface bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low px-space-md py-2 rounded-xl transition-colors font-medium"
            >
              Sign In
            </a>
            <a
              onClick={() => {
                navigate("/Authentication/Resgistration");
              }}
              data-path="sign-up"
              className="cursor-pointer font-label-md text-label-md bg-primary hover:bg-primary-container text-on-primary px-space-md py-2 rounded-xl transition-colors font-medium shadow-sm"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
