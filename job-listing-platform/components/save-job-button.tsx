"use client"

import { useState } from "react"
import { BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveJob } from "@/app/actions/job-actions"
import { useToast } from "@/hooks/use-toast"

export default function SaveJobButton({
  listingId,
  isSaved = false,
}: {
  listingId: string
  isSaved?: boolean
}) {
  const { toast } = useToast()
  const [saved, setSaved] = useState(isSaved)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSaveJob() {
    setIsLoading(true)

    try {
      const result = await saveJob(listingId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setSaved(result.action === "saved")
        toast({
          title: result.action === "saved" ? "Job Saved" : "Job Unsaved",
          description:
            result.action === "saved"
              ? "This job has been added to your saved jobs."
              : "This job has been removed from your saved jobs.",
        })
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
    <Button variant={saved ? "default" : "outline"} size="icon" onClick={handleSaveJob} disabled={isLoading}>
      <BookmarkIcon className="h-4 w-4" />
    </Button>
  )
}

