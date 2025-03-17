"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { saveJob, applyForJob } from "@/app/actions/job-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function JobActions({ jobId }: { jobId: string }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        })
        
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          
          // Check if job is saved
          if (data.user?.jobSeeker) {
            const savedRes = await fetch(`/api/jobs/${jobId}/saved`, {
              credentials: "include",
            });
            
            if (savedRes.ok) {
              const savedData = await savedRes.json();
              setSaved(savedData.saved);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [jobId])

  const handleSave = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=/jobs/${jobId}`)
      return
    }

    try {
      const result = await saveJob(jobId)
      if (result.success) {
        setSaved(result.action === "saved")
        toast({
          title: result.action === "saved" ? "Job Saved" : "Job Unsaved",
          description: result.action === "saved" 
            ? "This job has been added to your saved jobs." 
            : "This job has been removed from your saved jobs.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setApplying(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append("listingId", jobId)
      
      const result = await applyForJob(formData)
      
      if (result.success) {
        setShowApplyForm(false)
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit application",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <Button disabled>Loading...</Button>
  }

  // If user is not logged in
  if (!user) {
    return (
      <div className="space-y-4 mt-6">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default">
            <Link href={`/login?callbackUrl=/jobs/${jobId}`}>
              Login to Apply
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/register?callbackUrl=/jobs/${jobId}`}>
              Create Account
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Create an account or log in to apply for this position.
        </p>
      </div>
    )
  }

  // If user is an employer
  if (user.employer) {
    return (
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-2">
          Employers cannot apply for jobs. Switch to a job seeker account to apply.
        </p>
        <Button variant="outline" asChild>
          <Link href="/employer/dashboard">Go to Employer Dashboard</Link>
        </Button>
      </div>
    )
  }

  // Job seeker view
  return (
    <div className="mt-6">
      {showApplyForm ? (
        <Card>
          <form onSubmit={handleApplySubmit}>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resumeVersion">Resume Version</Label>
                <Input 
                  id="resumeVersion" 
                  name="resumeVersion" 
                  placeholder="e.g., Software Engineer Resume v2"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the name/version of your resume you're using for this application
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Write your cover letter here..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowApplyForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={applying}>
                  {applying ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowApplyForm(true)}
          >
            Apply Now
          </Button>
          <Button 
            variant="outline"
            onClick={handleSave}
          >
            {saved ? "Unsave Job" : "Save Job"}
          </Button>
        </div>
      )}
    </div>
  )
}