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

const QUEUE_NAME_USER_CREATE =
  process.env.QUEUE_NAME_USER_CREATE || 'aws-demo-user-create';

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

  async create(user: User) {
    await this.userModel.create(user);
    return { result: 'ok' };
  }

  sqsSend(user: User) {
    return this.sqsService.send(QUEUE_NAME_USER_CREATE, {
      id: uuidv4(),
      body: user,
    });
  }

  @SqsMessageHandler(QUEUE_NAME_USER_CREATE, false)
  async cmdCreate({ Body, ReceiptHandle }: Message) {
    await this.userModel.create(JSON.parse(Body));
    this.logger.log('Message handled successfully');
    this.sqs.send(
      new DeleteMessageCommand({
        QueueUrl: QUEUE_NAME_USER_CREATE,
        ReceiptHandle,
      }),
    );
  }

  @SqsConsumerEventHandler(QUEUE_NAME_USER_CREATE, 'processing_error')
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
