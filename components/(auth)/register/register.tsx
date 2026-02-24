"use client";

import { div } from "framer-motion/client";
// import Image from "next/image";
import RegisterForm from "./form";
import { motion } from "framer-motion";
import Link from "next/link";

const Register = ({
  companyId,
  isRegistered,
}: {
  companyId: string;
  isRegistered: boolean;
}) => {
  return (
    <div className="flex h-[98vh] items-center justify-center bg-white text-white">
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative md:rounded-3xl bg-black text-white md:shadow-2xl border border-gray-200 w-full max-w-md md:max-w-sm h-screen  md:h-[700px] overflow-hidden"
      >
        <div className="absolute top-30 md:top-10 w-full flex flex-col items-center">
          {/* <Image
            className="mb-4"
            src="/blissfulLogo.svg"
            height={60}
            width={180}
            alt="Logo"
          /> */}
          <h3 className="font-mono text-3xl font-semibold tracking-wide text-white">
            JayPee Groups
          </h3>
        </div>

        <div className="absolute bottom-0 w-full bg-white text-black py-10 px-8 ">
          {/* rounded-t-[40px] */}
          <h3 className="font-mono text-xl mb-6 text-center">Register</h3>
          {isRegistered ? (
            <div
              className="bg-white border-l-4 border-gray-500 p-4 mb-4"
              role="alert"
            >
              <p className="text-center text-sm text-gray-600 mb-4">
                There's already an account registered for this company. Please
                log in.
              </p>
              <Link
                href="/login"
                className="block w-full text-center bg-black text-white py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <RegisterForm companyId={companyId} />
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default Register;
