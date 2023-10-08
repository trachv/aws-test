import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateRequestDto {
  @ApiProperty({
    description: 'The name of the user',
  })
  @IsString({
    message: '$property is not valid. $property must be a string\n',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
