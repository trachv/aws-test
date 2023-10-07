import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './user.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsService,
} from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    private readonly sqsService: SqsService,
  ) {}

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
  cmdCreate({ Body }: Message) {
    return this.userModel.create(JSON.parse(Body));
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
