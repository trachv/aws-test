import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './user.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsService,
} from '@ssut/nestjs-sqs';
import { DeleteMessageCommand, Message, SQSClient } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly sqs: SQSClient;
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
  ) {
    this.sqs = new SQSClient({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
      region: this.configService.get<string>('aws.region'),
    });
  }

  create(user: User) {
    return this.userModel.create(user);
  }

  sqsSend(user: User) {
    return this.sqsService.send('aws-demo-user-create', {
      id: uuidv4(),
      body: user,
    });
  }

  @SqsMessageHandler('aws-demo-user-create', false)
  async cmdCreate({ Body, ReceiptHandle }: Message) {
    await this.userModel.create(JSON.parse(Body));
    this.logger.log('Message handled successfully');
    this.sqs.send(
      new DeleteMessageCommand({
        QueueUrl: 'aws-demo-user-create',
        ReceiptHandle,
      }),
    );
  }

  @SqsConsumerEventHandler('aws-demo-user-create', 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    this.logger.log('Error handle message', message, error);
  }

  update(key: UserKey, user: Partial<User>) {
    return this.userModel.update(key, user);
  }

  findOne(key: UserKey) {
    return this.userModel.get(key);
  }

  findAll() {
    return this.userModel.scan().exec();
  }
}
