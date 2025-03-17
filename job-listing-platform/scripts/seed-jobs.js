const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // First, check if we have any employers
  const employersCount = await prisma.employer.count()
  
  if (employersCount === 0) {
    console.log('Creating a test employer account first...')
    
    // Create a test employer user
    const user = await prisma.user.create({
      data: {
        email: 'employer@example.com',
        password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOD9RGGKMmL999vp93.KvjhJFMTVUPAr2', // 'password123'
        role: 'EMPLOYER',
      }
    })
    
    // Create the employer profile
    const employer = await prisma.employer.create({
      data: {
        userId: user.id,
        companyName: 'Example Company',
        industry: 'Technology',
        description: 'A leading technology company',
        website: 'https://example.com',
        location: 'New York, NY',
        isApproved: true,
        approvalDate: new Date(),
      }
    })
    
    console.log('Created test employer:', employer)
  }

  // Get the first employer
  const employer = await prisma.employer.findFirst()
  
  if (!employer) {
    console.log('No employers found even after attempting to create one.')
    return
  }

  // Sample job listings
  const jobListings = [
    {
      employerId: employer.id,
      title: "Senior Software Engineer",
      description: "We are looking for a Senior Software Engineer with expertise in React, Node.js, and cloud technologies to join our team.",
      location: "New York, NY",
      salaryRange: "$120,000 - $150,000",
      jobType: "FULL_TIME",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "ACTIVE",
      isActive: true
    },
    {
      employerId: employer.id,
      title: "Product Manager",
      description: "Join our team as a Product Manager to lead product development for our SaaS platform.",
      location: "San Francisco, CA",
      salaryRange: "$130,000 - $160,000",
      jobType: "FULL_TIME",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      status: "ACTIVE",
      isActive: true
    },
    {
      employerId: employer.id,
      title: "UX/UI Designer",
      description: "Looking for a creative UX/UI Designer with experience in designing web and mobile applications.",
      location: "Remote",
      salaryRange: "$90,000 - $120,000",
      jobType: "FULL_TIME",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: "ACTIVE",
      isActive: true
    },
    {
      employerId: employer.id,
      title: "Data Scientist",
      description: "Join our data team to build ML models and analyze large datasets.",
      location: "Boston, MA",
      salaryRange: "$110,000 - $140,000",
      jobType: "FULL_TIME",
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      status: "ACTIVE",
      isActive: true
    },
    {
      employerId: employer.id,
      title: "Frontend Developer (Part-time)",
      description: "Looking for a part-time Frontend Developer with React experience.",
      location: "Remote",
      salaryRange: "$40 - $60 per hour",
      jobType: "PART_TIME",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      status: "ACTIVE",
      isActive: true
    }
  ]

  // Create job listings
  for (const job of jobListings) {
    await prisma.jobListing.create({
      data: job
    })
  }

  console.log(`Created ${jobListings.length} job listings.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })