import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../utils/constants/constants';
import { Employer } from '../../employer/entities/employer.entity';
import { JobSeeker } from '../../job-seeker/entities/job-seeker.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Employer)
    private employerRepository: Repository<Employer>,
    @InjectRepository(JobSeeker)
    private jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // If admin role is allowed and user is admin, allow access
    if (roles.includes(Role.Admin) && user.role === Role.Admin) {
      return true;
    }

    // Check for employer role and profile
    if (roles.includes(Role.Employer) && user.role === Role.Employer) {
      const employer = await this.employerRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (!employer) {
        return false;
      }
      // Attach employer profile to request for service use
      request.employerProfile = employer;
      return true;
    }

    // Check for employee role and job seeker profile
    if (roles.includes(Role.Employee) && user.role === Role.Employee) {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (!jobSeeker) {
        return false;
      }
      // Attach job seeker profile to request for service use
      request.jobSeekerProfile = jobSeeker;
      return true;
    }

    return false;
  }
}
