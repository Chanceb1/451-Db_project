"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BriefcaseIcon, BuildingIcon, CalendarIcon, ClockIcon, MapPinIcon, ShareIcon } from "lucide-react"
import { prisma } from "@/lib/db"
import { formatDistance } from "date-fns"
import JobActions from "./job-actions"

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const job = await prisma.jobListing.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
    },
  })

  if (!job) {
    return notFound()
  }

  // Format the posted date
  const postedTimeAgo = formatDistance(new Date(job.postedDate), new Date(), {
    addSuffix: true,
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">{job.title}</h1>
      <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
        <div>{job.employer.companyName}</div>
        <div>•</div>
        <div>{job.location}</div>
        <div>•</div>
        <div>{job.jobType}</div>
        <div>•</div>
        <div>Posted {postedTimeAgo}</div>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Salary Range</h2>
              <p>{job.salaryRange}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Job Description</h2>
              <div className="mt-2 whitespace-pre-wrap">{job.description}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Application Deadline</h2>
              <p>{new Date(job.deadline).toLocaleDateString()}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">About the Company</h2>
              <p>{job.employer.description || "No company description provided."}</p>
            </div>

            {/* Use client component for auth-dependent UI */}
            <JobActions jobId={job.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

