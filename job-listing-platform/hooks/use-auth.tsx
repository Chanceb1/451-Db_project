"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        const res = await fetch("/api/me", {
          cache: "no-store",
          credentials: "include",
        })
        
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setError(null)
        } else {
          setUser(null)
          // Don't set error for 401 - that's expected when not logged in
          if (res.status !== 401) {
            setError("Failed to fetch user data")
          }
        }
      } catch (err) {
        console.error("Auth error:", err)
        setUser(null)
        setError("An error occurred while checking authentication")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const refetch = async () => {
    await fetchUser()
  }

  return { user, loading, error, refetch }

  async function fetchUser() {
    try {
      setLoading(true)
      const res = await fetch("/api/me", {
        cache: "no-store",
        credentials: "include",
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setError(null)
      } else {
        setUser(null)
        // Don't set error for 401 - that's expected when not logged in
        if (res.status !== 401) {
          setError("Failed to fetch user data")
        }
      }
    } catch (err) {
      console.error("Auth error:", err)
      setUser(null)
      setError("An error occurred while checking authentication")
    } finally {
      setLoading(false)
    }
  }
}