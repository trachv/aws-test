import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfig from './config/aws.config';
import { MySqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
    MySqsModule,
  ],
  providers: [],
  controllers: [],
  exports: [ConfigModule],
})
export class AppModule {}
