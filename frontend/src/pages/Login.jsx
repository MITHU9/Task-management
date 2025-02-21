import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos";
import { FiMail, FiLock, FiEyeOff, FiEye } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import Loader from "../components/loader/Loader";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAxiosPublic } from "../hooks/useAxiosPublic";

const Login = () => {
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signInWithGoogle, signInWithEmail, user } = useTaskContext();
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => {
        console.log(res);

        if (res.user) {
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

  const onSubmit = (data) => {
    const { email, password } = data;

    signInWithEmail(email, password)
      .then((res) => {
        if (res.user) {
          navigate("/home");
          setLoading(false);
          setError(null);
        } else {
          setError("User not found! Try again.");
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (user) {
    return <Navigate to={"/home"} />;
  }

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className="bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg"
        data-aos="fade-up"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Log in to your account and continue.
        </p>

        {/* Form with react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute top-3.5 md:top-5 left-3 text-gray-400 text-lg sm:text-xl" />
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full px-10 py-3 sm:py-4 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative">
            <FiLock className="absolute top-3 md:top-5 left-3 text-gray-400 text-lg sm:text-xl" />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className={`w-full px-10 py-3 sm:py-4 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-4 md:top-5 right-3 text-gray-400 focus:outline-none"
            >
              {passwordVisible ? (
                <FiEyeOff className="text-lg sm:text-xl" />
              ) : (
                <FiEye className="text-lg sm:text-xl" />
              )}
            </button>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold transition duration-300 text-sm sm:text-base"
          >
            Log In
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>

        {/* Google Sign-In */}
        <div className="my-4">
          <p className="text-center text-gray-500 text-sm sm:text-base">or</p>
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 py-3 sm:py-4 rounded-lg border border-gray-300 text-gray-800 font-semibold transition duration-300 text-sm sm:text-base"
          >
            <FcGoogle className="text-xl sm:text-2xl mr-2" />
            Sign in with Google
          </button>
        </div>

        {/* Redirect to Registration */}
        <p className="text-center text-gray-600 text-sm sm:text-base">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
