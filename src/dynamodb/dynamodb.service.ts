import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';
import { marshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly logger = new Logger(DynamoDBService.name);
  private readonly dynamoDB: DynamoDBClient;

  constructor(private readonly configService: ConfigService) {
    this.dynamoDB = new DynamoDBClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });
  }

  async createItem(tableName: string, item: any): Promise<void> {
    try {
      const command = new PutItemCommand({
        TableName: tableName,
        Item: marshall(item),
      });
      await this.dynamoDB.send(command);
      this.logger.log('Item created successfully');
    } catch (error) {
      this.logger.log('Error creating item:', error);
      throw error;
    }
  }
}
