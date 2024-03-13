import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The option for a question',
    example: 'Owl',
  })
  @IsNotEmpty()
  @Length(2, 255)
  email: string;

  @ApiProperty({
    description: 'The ID of the question',
    example: 1,
  })
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'Whether the option is correct or not',
    example: true,
  })
  @IsNotEmpty()
  @Length(2, 255)
  password: string;
}

export default CreateUserDto;
