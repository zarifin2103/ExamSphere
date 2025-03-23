import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

const SignupPage = () => {
  return (
    <AuthLayout
      title="Create a New Account"
      subtitle="Sign up to access the online examination system"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
