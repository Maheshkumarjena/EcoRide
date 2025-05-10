"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const VerifyEmail = () => {
  const router=useRouter();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log('user from local storage', storedUser)
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const currentTime = Date.now();
      if (userData.expiration && currentTime < userData.expiration) {
        setEmail(userData.email);
        sendVerificationEmail(userData.email);
      } else {
        localStorage.removeItem("user");
        router.push("/SignIn");
      }
    }
    else {
      router.push("/SignIn");
    }
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendVerificationEmail = async (userEmail) => {
    setLoading(true);
    try {
      const response = await axios.post("https://ecoride-m6zs.onrender.com/users/getOtp", {
        email: userEmail,
      });

      if (response.statusText !== "OK")
        throw new Error(response.message || "Failed to get verification code.");

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          to_email: userEmail,
          verificationCode: response.data.verificationCode,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setMessage("Verification email sent successfully!");
      toast.success("Verification email sent successfully!");
      setResendCooldown(30); // Start the cooldown
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("Failed to send verification email.");
      toast.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyCode = async () => {
    const code = verificationCode.join("");
    console.log("verification code ->", code);
    console.log(email);
    if (!code || code.length !== 6) {
      setMessage("Please enter a valid 6-digit verification code.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3002/users/verifyOtp", {
        email,
        verificationCode: code,
      });
  
      console.log("response =>",response)
      // Check response status
      if (response.status !== 200) {
        // Handle non-200 status codes (errors)
        throw new Error(response.data.message || "Verification failed.");
      }
  
      setMessage("Email verified successfully!");
      setIsVerified(true);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("Invalid verification code. Please try again.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isVerified) {
      setTimeout(() => {
        router.push("/");
      }, 3000); // Redirect after 3 seconds
    }
  }, [isVerified, router]);

  return (

<div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 dark:bg-gray-900">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
    {isVerified ? (
      <>
        <h1 className="text-xl font-semibold text-center mb-4 text-green-600 dark:text-green-400">
          {email} verified successfully!
        </h1>
        <p className="text-center text-purple-800 dark:text-purple-300">
          Redirecting to home page...
        </p>
      </>
    ) : (
      <>
        <h1 className="text-xl font-semibold text-center mb-4 text-purple-800 dark:text-purple-200">
          Email Verification
        </h1>
        <p className="text-center text-purple-800 dark:text-purple-300 mb-2">
          Verification email sent to:
        </p>
        <p className="text-center font-medium text-purple-600 dark:text-purple-400">
          {email}
        </p>

        {loading && <p className="text-center text-yellow-500 mt-3">Processing...</p>}

        <div className="flex justify-between mt-4">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              className="w-12 h-12 text-center text-xl border border-purple-300 dark:border-purple-600 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-purple-800 dark:text-purple-200"
            />
          ))}
        </div>
        <button
          onClick={verifyCode}
          className="w-full bg-purple-500 text-white py-2 mt-6 rounded-lg hover:bg-purple-600 disabled:bg-purple-300"
          disabled={loading}
        >
          Verify Code
        </button>
        {resendCooldown === 0 ? (
          <button
            onClick={() => sendVerificationEmail(email)}
            className="w-full bg-gray-500 text-white py-2 mt-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
            disabled={loading}
          >
            Resend Verification Code
          </button>
        ) : (
          <p className="text-center mt-2 text-gray-500">Resend in {resendCooldown}s</p>
        )}

        {message && (
          <p
            className={`text-center mt-3 ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </>
    )}
  </div>
</div>
  );
};

export default VerifyEmail;