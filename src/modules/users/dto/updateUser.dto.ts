import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, isString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the question',
    example: 1,
  })
  @Length(2, 255)
  name?: string;

  @IsOptional()
  @ApiProperty({
    description: 'The option for a question',
    example: 'Owl',
  })
  @Length(2, 255)
  email?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Whether the option is correct or not',
    example: true,
  })
  @Length(2, 255)
  password?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Whether the option is correct or not',
    example: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  })
  @IsString()
  refresh_token?: string;
}

export default UpdateUserDto;
