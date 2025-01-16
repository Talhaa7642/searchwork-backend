import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import { UserJob } from '../user-jobs/entities/user-job.entity';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import {
  Role,
  Gender,
  JobType,
  JobAvailability,
  Status,
} from '../utils/constants/constants';

const seedData = async (dataSource: DataSource) => {
  try {
    // Clear existing data
    await dataSource.getRepository(UserJob).delete({});
    await dataSource.getRepository(JobPost).delete({});
    await dataSource.getRepository(JobSeeker).delete({});
    await dataSource.getRepository(Employer).delete({});
    await dataSource.getRepository(User).delete({});

    // Repositories
    const userRepository = dataSource.getRepository(User);
    const employerRepository = dataSource.getRepository(Employer);
    const jobSeekerRepository = dataSource.getRepository(JobSeeker);
    const jobPostRepository = dataSource.getRepository(JobPost);
    const userJobRepository = dataSource.getRepository(UserJob);

    // Create users
    console.log('Creating users...');
    const users = [
      {
        email: 'employee@example.com',
        password: 'password123', // hashed 'password123'
        fullName: 'John Employee',
        role: Role.Employee,
        gender: Gender.Male,
        isEmailVerified: true,
      },
      {
        email: 'employer@example.com',
        password: 'password123',
        fullName: 'Jane Employer',
        role: Role.Employer,
        gender: Gender.Female,
        isEmailVerified: true,
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        fullName: 'Admin User',
        role: Role.Admin,
        gender: Gender.Other,
        isEmailVerified: true,
      },
    ];

    const savedUsers = await userRepository.save(users);
    console.log('Users created:', savedUsers.length);

    // Create employers
    console.log('Creating employers...');
    const employers = [
      {
        companyName: 'Tech Corp',
        industry: 'Technology',
        companySize: '100-500',
        registrationNumber: '12345',
        user: savedUsers.find((u) => u.role === Role.Employer),
      },
    ];

    const savedEmployers = await employerRepository.save(employers);
    console.log('Employers created:', savedEmployers.length);

    // Create job seekers
    console.log('Creating job seekers...');
    const jobSeekers = [
      {
        skills: 'JavaScript, TypeScript, Node.js',
        professionalExperience: '5 years in web development',
        qualification: 'Bachelor in Computer Science',
        majorSubjects: 'Computer Science',
        certificates: '2',
        certificatesData: 'AWS Certified, Google Cloud Certified',
        user: savedUsers.find((u) => u.role === Role.Employee),
      },
    ];

    const savedJobSeekers = await jobSeekerRepository.save(jobSeekers);
    console.log('Job seekers created:', savedJobSeekers.length);

    // Create job posts
    console.log('Creating job posts...');
    const jobPosts = [
      {
        title: 'Senior Software Engineer',
        type: JobType.FullTime,
        description: 'Looking for experienced software engineer',
        salary: 120000,
        availability: JobAvailability.Remote,
        location: 'New York, USA',
        status: Status.Hiring,
        employer: savedEmployers[0],
      },
      {
        title: 'Frontend Developer',
        type: JobType.FullTime,
        description: 'Frontend development position',
        salary: 90000,
        availability: JobAvailability.OnSite,
        location: 'San Francisco, USA',
        status: Status.Hiring,
        employer: savedEmployers[0],
      },
    ];

    const savedJobPosts = await jobPostRepository.save(jobPosts);
    console.log('Job posts created:', savedJobPosts.length);

    // Create job applications
    console.log('Creating job applications...');
    const userJobs = [
      {
        user: savedUsers.find((u) => u.role === Role.Employee),
        jobPost: savedJobPosts[0],
        status: Status.Applied,
        appliedAt: new Date(),
      },
      {
        user: savedUsers.find((u) => u.role === Role.Employee),
        jobPost: savedJobPosts[1],
        status: Status.Applied,
        appliedAt: new Date(),
      },
    ];

    const savedUserJobs = await userJobRepository.save(userJobs);
    console.log('Job applications created:', savedUserJobs.length);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

export default seedData;
