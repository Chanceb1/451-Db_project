"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the user type to match your database schema
type UserType = {
  id: string;
  email: string;
  role: string;
  jobSeeker?: {
    id: string;
    userId: string;
    fullName: string;
    [key: string]: any;
  };
  employer?: {
    id: string;
    userId: string;
    companyName: string;
    [key: string]: any;
  };
  admin?: {
    id: string;
    userId: string;
    [key: string]: any;
  };
  [key: string]: any;
} | null;

export default function Header() {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">JobSphere</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/jobs"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/jobs" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Find Jobs
            </Link>
            {user?.employer && (
              <Link
                href="/employer/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/employer") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Employer Dashboard
              </Link>
            )}
            {user?.jobSeeker && (
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                My Profile
              </Link>
            )}
            {user?.admin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-muted rounded"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {user.jobSeeker?.fullName?.charAt(0) || 
                       user.employer?.companyName?.charAt(0) || 
                       user.email?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">
                    {user.jobSeeker?.fullName || 
                     user.employer?.companyName || 
                     (user.email ? user.email.split('@')[0] : 'User')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/jobs"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Find Jobs
                </Link>
                {user?.employer && (
                  <Link
                    href="/employer/dashboard"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Employer Dashboard
                  </Link>
                )}
                {user?.jobSeeker && (
                  <Link
                    href="/profile"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    My Profile
                  </Link>
                )}
                {user?.admin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Admin Panel
                  </Link>
                )}
                {!user && (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

