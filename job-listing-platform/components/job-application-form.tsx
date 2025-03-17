"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { applyForJob } from "@/app/actions/job-actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function JobApplicationForm({ listingId }: { listingId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await applyForJob(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Your application has been submitted successfully.",
        })
        router.push("/jobs/applications")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form action={handleSubmit}>
        <CardHeader>
          <CardTitle>Apply for this Job</CardTitle>
          <CardDescription>Complete the form below to submit your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="hidden" name="listingId" value={listingId} />

          <div className="space-y-2">
            <Label htmlFor="resumeVersion">Resume Version</Label>
            <Input id="resumeVersion" name="resumeVersion" placeholder="e.g., Software Engineer Resume v2" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
              className="min-h-[200px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting Application..." : "Submit Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

