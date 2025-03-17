"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { generateToken, hashPassword, verifyPassword } from "@/lib/auth"
import type { Role } from "@prisma/client"

export async function register(
  email: string,
  password: string,
  fullName: string,
  role: "JOB_SEEKER" | "EMPLOYER" = "JOB_SEEKER"
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, message: "User already exists" }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    })

    // Create profile based on role
    if (role === "JOB_SEEKER") {
      await prisma.jobSeeker.create({
        data: {
          userId: user.id,
          fullName,
        },
      })
    } else if (role === "EMPLOYER") {
      await prisma.employer.create({
        data: {
          userId: user.id,
          companyName: fullName,
        },
      })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",  // Add explicit path
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "An error occurred during registration" }
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, message: "Invalid credentials" }
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { success: false, message: "Invalid credentials" }
    }

    const token = generateToken(user.id, user.role)

    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",  // Add explicit path
    })

    return { success: true, role: user.role }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    // This is the correct way to delete a cookie
    cookieStore.delete({
      name: "token",
      path: "/"
    })
    return redirect("/login")
  } catch (error) {
    console.error("Logout error:", error)
    return redirect("/login")
  }
}

