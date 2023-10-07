import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import awsConfig from './config/aws.config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

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
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
  exports: [ConfigModule],
})
export class AppModule {}
