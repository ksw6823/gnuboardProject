import { Controller, Get } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(): Promise<Job[]> {
    return this.jobService.findAll();
  }
} 