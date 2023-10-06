import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class User {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class SendMessageDto {
  @IsNotEmpty()
  readonly user: User;
}
