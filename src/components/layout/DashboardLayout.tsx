import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Settings,
  Users,
  LogOut,
  Menu,
  ChevronDown,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "admin" | "supervisor" | "participant";
  userName?: string;
}

const DashboardLayout = ({
  children,
  userRole = "admin",
  userName = "Admin User",
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Exams",
      href: "/admin/exams",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Question Banks",
      href: "/admin/question-banks",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Exam Configuration",
      href: "/admin/exam-config",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const supervisorNavItems = [
    {
      title: "Dashboard",
      href: "/supervisor/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Assigned Exams",
      href: "/supervisor/exams",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Monitor Exams",
      href: "/supervisor/monitor",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const participantNavItems = [
    {
      title: "Dashboard",
      href: "/participant/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Available Exams",
      href: "/participant/exams",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "My Results",
      href: "/participant/results",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  const navItems = {
    admin: adminNavItems,
    supervisor: supervisorNavItems,
    participant: participantNavItems,
  }[userRole];

  const handleLogout = async () => {
    try {
      // Import and use the logout function from our Firebase lib
      const { logoutUser } = await import("@/lib/firebase/users");
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-40 lg:hidden p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-center border-b px-4">
            <h1 className="text-xl font-bold text-primary">Exam System</h1>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <h2 className="text-lg font-semibold hidden lg:block">
            {navItems.find((item) => item.href === location.pathname)?.title ||
              "Dashboard"}
          </h2>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {userName.charAt(0)}
                  </div>
                  <span className="hidden md:inline-block">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
