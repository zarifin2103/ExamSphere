import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import LoginForm from "./auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/lib/firebase/users";

const Home = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Redirect to home after logout
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // If user is already logged in, redirect to appropriate dashboard
  React.useEffect(() => {
    if (currentUser && userProfile) {
      switch (userProfile.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "supervisor":
          navigate("/supervisor/dashboard");
          break;
        case "participant":
          navigate("/participant/dashboard");
          break;
      }
    }
  }, [currentUser, userProfile, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">
              Online Examination System
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-800">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Contact
                </Link>
              </li>
              {currentUser && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Welcome to the Online Examination System
            </h2>
            <p className="text-xl text-gray-600">
              A comprehensive platform for managing and taking online exams with
              secure authentication and real-time monitoring.
            </p>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Key Features:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500 mr-2 mt-1"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Comprehensive exam management for administrators</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500 mr-2 mt-1"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>
                    Flexible question bank system with detailed scoring
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500 mr-2 mt-1"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Real-time monitoring for exam supervisors</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500 mr-2 mt-1"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Secure authentication for all user roles</span>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-800">
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-700">
                    Login with your credentials or contact your administrator
                    for access to the system.
                  </CardDescription>
                  <div className="mt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="flex justify-center">
            {!currentUser ? (
              <LoginForm />
            ) : (
              <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-center">
                    You are currently logged in as{" "}
                    {userProfile?.displayName || currentUser.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="mb-4">Role: {userProfile?.role || "User"}</p>
                    <Button onClick={handleLogout} variant="destructive">
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Online Examination System
              </h3>
              <p className="text-gray-300">
                A comprehensive platform for managing and taking online exams
                with secure authentication and real-time monitoring.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-300 space-y-2">
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +1 (123) 456-7890
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  support@examonline.com
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  123 Exam Street, Education City
                </p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Online Examination System. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
