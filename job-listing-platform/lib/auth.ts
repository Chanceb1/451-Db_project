import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "./db"
import type { Role } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export function generateToken(userId: string, role: Role) {
  return sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

// A simpler function to just verify the token
export function verifyToken(token: string) {
  try {
    return verify(token, process.env.JWT_SECRET!) as { userId: string; role: Role }
  } catch (error) {
    return null
  }
}

// Create separate client and server auth functions

// For server components
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        jobSeeker: true,
        employer: true,
        admin: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

export function getUserRole(user: any) {
  if (user?.admin) return "ADMIN"
  if (user?.employer) return "EMPLOYER"
  if (user?.jobSeeker) return "JOB_SEEKER"
  return null
}

