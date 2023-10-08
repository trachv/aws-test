import { ApiProperty } from '@nestjs/swagger';

export class UserCreateResponseDto {
  @ApiProperty({
    description: 'The result of the user creation',
  })
  readonly result: string;
}
