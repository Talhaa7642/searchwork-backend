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

    if (roles.includes(Role.Admin) && user.role === Role.Admin) {
      return true;
    }

    if (roles.includes(Role.Employer) && user.role === Role.Employer) {
      if (context.getHandler().name === 'create') {
        return true;
      }
      const employer = await this.employerRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (!employer) {
        return false;
      }
      request.employerProfile = employer;
      return true;
    }

    if (roles.includes(Role.Employee) && user.role === Role.Employee) {
      if (context.getHandler().name === 'create') {
        return true;
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (!jobSeeker) {
        return false;
      }
      request.jobSeekerProfile = jobSeeker;
      return true;
    }

    return false;
  }
}
