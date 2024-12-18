import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Location } from '../location/entities/location.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { Employer } from '../employer/entities/employer.entity';
import { UserJob } from '../user-jobs/entities/user-job.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import {
  Gender,
  Role,
  JobType,
  JobAvailability,
  Status,
  ExperienceLevel,
  JobDuration,
} from '../utils/constants/constants';
import { dataSourceOptions } from '../../db/data-source';
import * as bcrypt from 'bcryptjs';

console.log('Starting seed process...');

const seedData = async (dataSource: DataSource) => {
  console.log('Initializing repositories...');

  const userRepository = dataSource.getRepository(User);
  const locationRepository = dataSource.getRepository(Location);
  const jobSeekerRepository = dataSource.getRepository(JobSeeker);
  const employerRepository = dataSource.getRepository(Employer);
  const jobPostRepository = dataSource.getRepository(JobPost);
  const userJobRepository = dataSource.getRepository(UserJob);

  console.log('Creating location data...');
  const locations = [
    {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      address: '123 Main St',
      postalCode: '10001',
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      address: '456 Elm St',
      postalCode: '90001',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      address: '789 Oak St',
      postalCode: '60601',
      latitude: 41.8781,
      longitude: -87.6298,
    },
    {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      address: '321 Tech Ave',
      postalCode: '94105',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      address: '567 Startup Blvd',
      postalCode: '73301',
      latitude: 30.2672,
      longitude: -97.7431,
    },
  ];

  console.log('Saving locations...');
  const savedLocations = await locationRepository.save(locations);
  console.log('Locations saved:', savedLocations.length);

  console.log('Creating user data...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      fullName: 'John Doe',
      email: 'talhashabir0@gmail.com',
      password: hashedPassword,
      phoneNumber: '+1234567890',
      role: Role.Employee,
      gender: Gender.Male,
      location: savedLocations[0],
      isEmailVerified: true,
    },
    {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      phoneNumber: '+1234567891',
      role: Role.Employer,
      gender: Gender.Female,
      location: savedLocations[1],
      isEmailVerified: true,
    },
    {
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
      phoneNumber: '+1234567892',
      role: Role.Employee,
      gender: Gender.Other,
      location: savedLocations[2],
      isEmailVerified: true,
    },
    {
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      password: hashedPassword,
      phoneNumber: '+1234567893',
      role: Role.Employer,
      gender: Gender.Female,
      location: savedLocations[3],
      isEmailVerified: true,
    },
    {
      fullName: 'Mike Brown',
      email: 'mike@example.com',
      password: hashedPassword,
      phoneNumber: '+1234567894',
      role: Role.Admin,
      gender: Gender.Male,
      location: savedLocations[4],
      isEmailVerified: false,
    },
  ];

  console.log('Saving users...');
  const savedUsers = await userRepository.save(users);
  console.log('Users saved:', savedUsers.length);

  console.log('Creating job seekers...');
  const jobSeekers = [
    {
      skills: 'JavaScript, TypeScript, Node.js, React, AWS',
      professionalExperience: '5 years of web development',
      qualification: 'Bachelor in Computer Science',
      majorSubjects: 'Computer Science',
      certificates: '2',
      certificatesData: 'AWS Certified, Google Cloud Certified',
      user: savedUsers[0],
    },
    {
      skills: 'Python, Data Science, Machine Learning, TensorFlow',
      professionalExperience: '3 years of data science',
      qualification: 'Master in Data Science',
      majorSubjects: 'Data Science',
      certificates: '1',
      certificatesData: 'TensorFlow Developer Certificate',
      user: savedUsers[2],
    },
    {
      skills: 'UI/UX Design, Figma, Adobe XD, HTML, CSS',
      professionalExperience: '2 years of UI/UX design',
      qualification: 'Bachelor in Design',
      majorSubjects: 'Interactive Design',
      certificates: '2',
      certificatesData: 'UI/UX Design Certificate, Adobe Certified',
      user: savedUsers[4],
    },
  ];

  console.log('Saving job seekers...');
  await jobSeekerRepository.save(jobSeekers);
  console.log('Job seekers saved successfully');

  console.log('Creating employers...');
  const employers = [
    {
      companyName: 'Tech Corp',
      industry: 'Technology',
      companySize: '50-100',
      registrationNumber: '12345',
      user: savedUsers[1],
    },
    {
      companyName: 'Innovation Labs',
      industry: 'Software Development',
      companySize: '100-500',
      registrationNumber: '67890',
      user: savedUsers[3],
    },
  ];

  console.log('Saving employers...');
  const savedEmployers = await employerRepository.save(employers);
  console.log('Employers saved successfully');

  console.log('Creating job posts...');
  const jobPosts = [
    {
      title: 'Senior JavaScript Developer',
      type: JobType.FullTime,
      description: 'Looking for an experienced JavaScript developer',
      requirements: 'Min 5 years experience with modern JavaScript',
      salary: 120000,
      availability: JobAvailability.Remote,
      experienceLevel: ExperienceLevel.Expert,
      duration: JobDuration.Permanent,
      status: Status.Hiring,
      location: savedLocations[0],
      employer: savedEmployers[0],
    },
    {
      title: 'Data Scientist',
      type: JobType.FullTime,
      description: 'Seeking a data scientist for ML projects',
      requirements: 'Masters in Data Science or related field',
      salary: 130000,
      availability: JobAvailability.Hybrid,
      experienceLevel: ExperienceLevel.Intermediate,
      duration: JobDuration.Permanent,
      status: Status.Hiring,
      location: savedLocations[1],
      employer: savedEmployers[0],
    },
    {
      title: 'Frontend Developer',
      type: JobType.PartTime,
      description: 'Frontend developer needed for UI/UX projects',
      requirements: '3+ years of React experience',
      salary: 80000,
      availability: JobAvailability.OnSite,
      experienceLevel: ExperienceLevel.Entry,
      duration: JobDuration.Temporary,
      status: Status.Hiring,
      location: savedLocations[2],
      employer: savedEmployers[0],
    },
    {
      title: 'UI/UX Designer',
      type: JobType.FullTime,
      description: 'Creative UI/UX designer needed for innovative projects',
      requirements: 'Strong portfolio and 3+ years experience',
      salary: 95000,
      availability: JobAvailability.Hybrid,
      experienceLevel: ExperienceLevel.Intermediate,
      duration: JobDuration.Permanent,
      status: Status.Hiring,
      location: savedLocations[3],
      employer: savedEmployers[1],
    },
    {
      title: 'DevOps Engineer',
      type: JobType.FullTime,
      description: 'Seeking DevOps engineer for cloud infrastructure',
      requirements: 'Experience with AWS, Docker, and Kubernetes',
      salary: 140000,
      availability: JobAvailability.Remote,
      experienceLevel: ExperienceLevel.Senior,
      duration: JobDuration.Permanent,
      status: Status.Hiring,
      location: savedLocations[4],
      employer: savedEmployers[1],
    },
  ];

  console.log('Saving job posts...');
  const savedJobPosts = await jobPostRepository.save(jobPosts);
  console.log('Job posts saved:', savedJobPosts.length);

  console.log('Creating user jobs (applications)...');
  const userJobs = [
    {
      user: savedUsers[0],
      jobPost: savedJobPosts[0],
      status: Status.Applied,
      appliedAt: new Date(),
    },
    {
      user: savedUsers[0],
      jobPost: savedJobPosts[2],
      status: Status.Accepted,
      appliedAt: new Date(),
    },
    {
      user: savedUsers[2],
      jobPost: savedJobPosts[1],
      status: Status.Applied,
      appliedAt: new Date(),
    },
    {
      user: savedUsers[4],
      jobPost: savedJobPosts[3],
      status: Status.Applied,
      appliedAt: new Date(),
    },
    {
      user: savedUsers[0],
      jobPost: savedJobPosts[4],
      status: Status.Hiring,
      appliedAt: new Date(),
    },
  ];

  console.log('Saving user jobs...');
  await userJobRepository.save(userJobs);
  console.log('User jobs saved successfully');

  console.log('Seeding completed successfully!');
};

// Create a self-executing async function to run the seed
(async () => {
  console.log('Connecting to database...');
  try {
    // Use the existing data source configuration
    const dataSource = new DataSource({
      ...dataSourceOptions,
      entities: [User, Location, JobSeeker, Employer, UserJob, JobPost],
    });

    console.log('Initializing connection...');
    await dataSource.initialize();
    console.log('Database connected successfully');

    await seedData(dataSource);

    console.log('Closing database connection...');
    await dataSource.destroy();
    console.log('Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
})();

export default seedData;
