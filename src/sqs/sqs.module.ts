import { Module } from '@nestjs/common';
import { SqsController } from './sqs.controller';
import { SqsService } from './sqs.service';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: 'TEST',
          queueUrl: 'TEST',
          region: 'us-east-1',
        },
      ],
      producers: [],
    }),
    ConfigModule,
  ],
  providers: [SqsService],
  controllers: [SqsController],
})
export class MySqsModule {}
