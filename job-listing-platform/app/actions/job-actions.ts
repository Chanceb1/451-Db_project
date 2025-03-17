"use server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createJobListing(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || !user.employer) {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const salaryRange = formData.get("salaryRange") as string
  const jobType = formData.get("jobType") as string
  const deadline = new Date(formData.get("deadline") as string)

  try {
    await prisma.jobListing.create({
      data: {
        employerId: user.employer.id,
        title,
        description,
        location,
        salaryRange,
        jobType: jobType as any,
        deadline,
      },
    })

    revalidatePath("/employer/jobs")
    return { success: true }
  } catch (error) {
    console.error("Create job listing error:", error)
    return { error: "Failed to create job listing" }
  }
}

export async function updateJobListing(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || !user.employer) {
    return { error: "Unauthorized" }
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const salaryRange = formData.get("salaryRange") as string
  const jobType = formData.get("jobType") as string
  const deadline = new Date(formData.get("deadline") as string)
  const status = formData.get("status") as string

  try {
    const jobListing = await prisma.jobListing.findUnique({
      where: { id },
      include: { employer: true },
    })

    if (!jobListing || jobListing.employer.userId !== user.id) {
      return { error: "Unauthorized" }
    }

    await prisma.jobListing.update({
      where: { id },
      data: {
        title,
        description,
        location,
        salaryRange,
        jobType: jobType as any,
        deadline,
        status: status as any,
      },
    })

    revalidatePath("/employer/jobs")
    revalidatePath(`/jobs/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Update job listing error:", error)
    return { error: "Failed to update job listing" }
  }
}

export async function deleteJobListing(id: string) {
  const user = await getCurrentUser()

  if (!user || !user.employer) {
    return { error: "Unauthorized" }
  }

  try {
    const jobListing = await prisma.jobListing.findUnique({
      where: { id },
      include: { employer: true },
    })

    if (!jobListing || jobListing.employer.userId !== user.id) {
      return { error: "Unauthorized" }
    }

    await prisma.jobListing.delete({
      where: { id },
    })

    revalidatePath("/employer/jobs")
    return { success: true }
  } catch (error) {
    console.error("Delete job listing error:", error)
    return { error: "Failed to delete job listing" }
  }
}

export async function applyForJob(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || !user.jobSeeker) {
    return { error: "Unauthorized" }
  }

  const listingId = formData.get("listingId") as string
  const coverLetter = formData.get("coverLetter") as string
  const resumeVersion = formData.get("resumeVersion") as string

  try {
    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        listingId,
        seekerId: user.jobSeeker.id,
      },
    })

    if (existingApplication) {
      return { error: "You have already applied for this job" }
    }

    await prisma.application.create({
      data: {
        listingId,
        seekerId: user.jobSeeker.id,
        coverLetter,
        resumeVersion,
      },
    })

    // Create notification for employer
    const jobListing = await prisma.jobListing.findUnique({
      where: { id: listingId },
      include: { employer: true },
    })

    if (jobListing) {
      await prisma.notification.create({
        data: {
          userId: jobListing.employer.userId,
          type: "NEW_APPLICATION",
          message: `New application received for ${jobListing.title}`,
        },
      })
    }

    revalidatePath("/jobs/applications")
    return { success: true }
  } catch (error) {
    console.error("Apply for job error:", error)
    return { error: "Failed to apply for job" }
  }
}

export async function saveJob(listingId: string) {
  const user = await getCurrentUser()

  if (!user || !user.jobSeeker) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if already saved
    const existingSaved = await prisma.savedJob.findFirst({
      where: {
        listingId,
        seekerId: user.jobSeeker.id,
      },
    })

    if (existingSaved) {
      // Unsave
      await prisma.savedJob.delete({
        where: { id: existingSaved.id },
      })
      revalidatePath("/jobs/saved")
      return { success: true, action: "unsaved" }
    } else {
      // Save
      await prisma.savedJob.create({
        data: {
          listingId,
          seekerId: user.jobSeeker.id,
        },
      })
      revalidatePath("/jobs/saved")
      return { success: true, action: "saved" }
    }
  } catch (error) {
    console.error("Save job error:", error)
    return { error: "Failed to save job" }
  }
}

export async function updateApplicationStatus(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || !user.employer) {
    return { error: "Unauthorized" }
  }

  const applicationId = formData.get("applicationId") as string
  const status = formData.get("status") as string

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        jobListing: {
          include: { employer: true },
        },
        jobSeeker: {
          include: { user: true },
        },
      },
    })

    if (!application || application.jobListing.employer.userId !== user.id) {
      return { error: "Unauthorized" }
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: status as any },
    })

    // Create notification for job seeker
    await prisma.notification.create({
      data: {
        userId: application.jobSeeker.userId,
        type: "APPLICATION_UPDATE",
        message: `Your application for ${application.jobListing.title} has been updated to ${status}`,
      },
    })

    revalidatePath("/employer/applications")
    return { success: true }
  } catch (error) {
    console.error("Update application status error:", error)
    return { error: "Failed to update application status" }
  }
}

