import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: (_, configService: ConfigService) => {
          return {
            schema: UserSchema,
            options: {
              tableName: configService.get<string>('USER_TABLE_NAME'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
