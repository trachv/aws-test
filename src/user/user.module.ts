import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { SqsModule } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        options: {
          tableName: 'users',
        },
      },
    ]),
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const region = configService.get<string>('aws.region');

        return {
          consumers: [
            {
              name: 'aws-demo-user-create',
              queueUrl: 'aws-demo-user-create',
              region,
              handleMessage: (message: Message) => message,
              shouldDeleteMessages: false,
            },
          ],
          producers: [
            {
              name: 'aws-demo-user-create',
              queueUrl: 'aws-demo-user-create',
              region,
              handleMessage: (message: Message) => message,
              shouldDeleteMessages: false,
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
