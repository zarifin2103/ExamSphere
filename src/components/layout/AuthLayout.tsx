import React, { ReactNode } from "react";
import { Card } from "../ui/card";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title = "Welcome to Online Examination System",
  subtitle = "Please sign in to continue",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute top-8 left-8">
        <div className="flex items-center gap-2">
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
            className="text-primary"
          >
            <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
            <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M2 8h20" />
            <path d="M2 14h20" />
          </svg>
          <span className="text-xl font-bold text-primary">ExamSystem</span>
        </div>
      </div>

      <Card className="w-full max-w-md p-8 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </Card>

      <div className="absolute bottom-4 text-center w-full text-sm text-muted-foreground">
        © {new Date().getFullYear()} Online Examination System. All rights
        reserved.
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>
  );
}
