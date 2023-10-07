// sqs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { UserService } from '../user/user.service';
import { SendMessageDto } from './dtos/send-message.request.dto';

@Injectable()
export class SqsService {
  private readonly sqs: SQSClient;
  private readonly logger = new Logger(SqsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.sqs = new SQSClient({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
      region: this.configService.get<string>('aws.region'),
    });
  }

  async sendMessage(
    queueName: string,
    messageBody: SendMessageDto,
  ): Promise<void> {
    const params = {
      QueueUrl: queueName,
      MessageBody: JSON.stringify(messageBody),
    };

    try {
      await this.sqs.send(new SendMessageCommand(params));
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }

  @SqsMessageHandler('TEST', false)
  public async handleMessage(message: Message) {
    const messageBody = JSON.parse(message.Body);
    await this.userService.create(messageBody);
    this.logger.log('Message handled successfully', message);
  }

  @SqsConsumerEventHandler('TEST', 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    this.logger.log('Error handle message', message, error);
  }
}
