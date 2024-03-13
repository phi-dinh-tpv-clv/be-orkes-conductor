import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostsService } from './posts.service';

@Injectable()
export class CronPostService {
  private readonly logger = new Logger(PostsService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    console.log('Running cron job...');
  }
}
