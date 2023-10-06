import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import awsConfig from './config/aws.config';
import { MySqsModule } from './sqs/sqs.module';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
    DynamooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        aws: {
          accessKeyId: configService.get<string>('aws.accessKeyId'),
          secretAccessKey: configService.get<string>('aws.secretAccessKey'),
          region: configService.get<string>('aws.region'),
        },
      }),
      inject: [ConfigService],
    }),
    MySqsModule,
  ],
  providers: [],
  controllers: [],
  exports: [ConfigModule],
})
export class AppModule {}
