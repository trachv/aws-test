import { Body, Controller, Post } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './dtos/send-message.request.dto';

@Controller('sqs')
export class SqsController {
  private queueName: string;
  constructor(
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
  ) {
    this.queueName = this.configService.get<string>('aws.queueName');
  }

  @Post('send-message')
  async sendMessage(@Body() message: SendMessageDto) {
    await this.sqsService.sendMessage(this.queueName, message);

    return { result: 'Message sent to SQS' };
  }
}
