import { IsNotEmpty, Length } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @Length(1, 255)
  readonly message: string;
}
