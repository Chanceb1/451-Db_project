import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BriefcaseIcon, BuildingIcon, SearchIcon } from "lucide-react"
import { prisma } from "@/lib/db"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Convert searchParams to await pattern
  const params = await Promise.resolve(searchParams);
  
  const query = (params.q as string) || ""
  const location = (params.location as string) || ""
  const jobType = (params.jobType as string) || ""

  // Fetch jobs from database
  const jobs = await prisma.jobListing.findMany({
    where: {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        location ? { location: { contains: location, mode: "insensitive" } } : {},
        jobType && jobType !== "ALL" ? { jobType: jobType as any } : {},
        { status: "ACTIVE" },
        { isActive: true },
        { deadline: { gt: new Date() } },
      ],
    },
    include: {
      employer: true,
    },
    orderBy: {
      postedDate: "desc",
    },
    take: 20,
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Find Jobs</h1>
          <p className="text-muted-foreground">Browse through our latest job listings and find your next opportunity</p>
        </div>

        {/* Search Form */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="search">Keywords</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    name="q"
                    placeholder="Job title, keywords, or company"
                    className="pl-9"
                    defaultValue={query}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, state, or remote"
                    className="pl-9"
                    defaultValue={location}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="jobType">Job Type</Label>
                <Select name="jobType" defaultValue={jobType}>
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remote" name="remote" />
                <label
                  htmlFor="remote"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remote Only
                </label>
              </div>
              <Button type="submit">Search Jobs</Button>
            </div>
          </form>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <BriefcaseIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.employer.companyName}</p>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-primary">{job.salaryRange || "Competitive"}</div>
                    </div>
                    <div className="mt-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {job.jobType.replace("_", " ")}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {job.location}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <SearchIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
              <p className="mt-2 text-center text-muted-foreground">
                We couldn&apos;t find any jobs matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

