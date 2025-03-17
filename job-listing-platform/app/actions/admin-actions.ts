"use server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function approveEmployer(employerId: string) {
  const user = await getCurrentUser()

  if (!user || !user.admin) {
    return { error: "Unauthorized" }
  }

  try {
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      include: { user: true },
    })

    if (!employer) {
      return { error: "Employer not found" }
    }

    await prisma.employer.update({
      where: { id: employerId },
      data: {
        isApproved: true,
        approvalDate: new Date(),
      },
    })

    // Create notification for employer
    await prisma.notification.create({
      data: {
        userId: employer.userId,
        type: "ACCOUNT_APPROVED",
        message: "Your employer account has been approved. You can now post job listings.",
      },
    })

    revalidatePath("/admin/employers")
    return { success: true }
  } catch (error) {
    console.error("Approve employer error:", error)
    return { error: "Failed to approve employer" }
  }
}

export async function generateAnalytics(reportType: string) {
  const user = await getCurrentUser()

  if (!user || !user.admin) {
    return { error: "Unauthorized" }
  }

  try {
    let metrics: any = {}

    if (reportType === "USER_STATS") {
      const totalUsers = await prisma.user.count()
      const jobSeekers = await prisma.jobSeeker.count()
      const employers = await prisma.employer.count()
      const admins = await prisma.admin.count()

      metrics = {
        totalUsers,
        jobSeekers,
        employers,
        admins,
        lastUpdated: new Date(),
      }
    } else if (reportType === "JOB_STATS") {
      const totalJobs = await prisma.jobListing.count()
      const activeJobs = await prisma.jobListing.count({
        where: { status: "ACTIVE" },
      })
      const expiredJobs = await prisma.jobListing.count({
        where: { status: "EXPIRED" },
      })
      const filledJobs = await prisma.jobListing.count({
        where: { status: "FILLED" },
      })

      metrics = {
        totalJobs,
        activeJobs,
        expiredJobs,
        filledJobs,
        lastUpdated: new Date(),
      }
    } else if (reportType === "APPLICATION_STATS") {
      const totalApplications = await prisma.application.count()
      const pendingApplications = await prisma.application.count({
        where: { status: "PENDING" },
      })
      const reviewedApplications = await prisma.application.count({
        where: { status: "REVIEWED" },
      })
      const shortlistedApplications = await prisma.application.count({
        where: { status: "SHORTLISTED" },
      })
      const interviewApplications = await prisma.application.count({
        where: { status: "INTERVIEW" },
      })
      const rejectedApplications = await prisma.application.count({
        where: { status: "REJECTED" },
      })
      const acceptedApplications = await prisma.application.count({
        where: { status: "ACCEPTED" },
      })

      metrics = {
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        interviewApplications,
        rejectedApplications,
        acceptedApplications,
        lastUpdated: new Date(),
      }
    }

    await prisma.analytics.create({
      data: {
        adminId: user.admin.id,
        reportType,
        metrics,
      },
    })

    revalidatePath("/admin/analytics")
    return { success: true, metrics }
  } catch (error) {
    console.error("Generate analytics error:", error)
    return { error: "Failed to generate analytics" }
  }
}

export async function approveReview(reviewId: string) {
  const user = await getCurrentUser()

  if (!user || !user.admin) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    })

    revalidatePath("/admin/reviews")
    return { success: true }
  } catch (error) {
    console.error("Approve review error:", error)
    return { error: "Failed to approve review" }
  }
}

