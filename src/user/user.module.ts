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

        const QUEUE_NAME_USER_CREATE =
          process.env.QUEUE_NAME_USER_CREATE || 'aws-demo-user-create';

        return {
          consumers: [
            {
              name: QUEUE_NAME_USER_CREATE,
              queueUrl: QUEUE_NAME_USER_CREATE,
              region,
              handleMessage: (message: Message) => message,
              shouldDeleteMessages: false,
            },
          ],
          producers: [
            {
              name: QUEUE_NAME_USER_CREATE,
              queueUrl: QUEUE_NAME_USER_CREATE,
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
