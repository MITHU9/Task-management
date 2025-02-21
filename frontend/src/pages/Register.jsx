import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Import React Hook Form
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import Loader from "../components/loader/Loader";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAxiosPublic } from "../hooks/useAxiosPublic";

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, signInWithGoogle, createUserWithEmail, updateUser } =
    useTaskContext();

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => {
        if (res?.user) {
          const userData = {
            email: res.user.email,
            username: res.user.displayName,
          };

          axiosPublic.post("/new-user", userData).then((res) => {
            console.log(res.data);
          });
          navigate("/home");
        } else {
          setError("User not found");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleFormSubmit = async (data) => {
    const { name, email, password, checkbox } = data;

    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;

    if (!upperCase.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!lowerCase.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (checkbox) {
      createUserWithEmail(email, password, name)
        .then((res) => {
          if (res.user) {
            updateUser({ displayName: name })
              .then(() => {
                console.log("User updated");
              })
              .catch((err) => {
                console.log(err);
              });

            const userData = {
              email,
              username: name,
            };

            axiosPublic.post("/new-user", userData).then((res) => {
              console.log(res.data);
            });

            navigate("/home");
          } else {
            setError("Registration Failed");
            setLoading(false);
          }
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("Please accept terms & conditions");
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div
        className="bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg mt-4"
        data-aos="fade-up"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Fill in the details below to get started.
        </p>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="relative">
            <FiUser className="absolute top-3 md:top-4 left-3 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
              className="w-full px-10 py-3 sm:py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <FiMail className="absolute top-3.5 md:top-5 left-3 text-gray-400 text-lg sm:text-xl" />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-10 py-3 sm:py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <FiLock className="absolute top-3 md:top-5 left-3 text-gray-400 text-lg sm:text-xl" />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-10 py-3 sm:py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-3.5 md:top-5 right-3 text-gray-400 focus:outline-none"
            >
              {passwordVisible ? (
                <FiEyeOff className="text-lg sm:text-xl" />
              ) : (
                <FiEye className="text-lg sm:text-xl" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Checkbox */}
          <label className="cursor-pointer label justify-start gap-2">
            <input
              type="checkbox"
              {...register("checkbox", {
                required: "You must accept terms and conditions",
              })}
              className="checkbox checkbox-success"
            />
            <span className="label-text ml-1">Accept terms and conditions</span>
          </label>
          {errors.checkbox && (
            <p className="text-red-600 text-sm">{errors.checkbox.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 rounded-lg font-semibold transition duration-300 text-sm sm:text-base"
          >
            Register
          </button>
          {error && (
            <div className="text-red-600">
              <label>{error}</label>
            </div>
          )}
        </form>

        <div className="my-4">
          <p className="text-center text-gray-500 text-sm sm:text-base">or</p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 py-3 sm:py-4 rounded-lg border border-gray-300 text-gray-800 font-semibold transition duration-300 text-sm sm:text-base"
          >
            <FcGoogle className="text-xl sm:text-2xl mr-2" />
            Sign in with Google
          </button>
        </div>

        {/* Redirect to Login */}
        <p className="text-center text-gray-600 text-sm sm:text-base mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
