import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DynamoDBService],
  exports: [DynamoDBService],
})
export class DynamoDBModule {}
