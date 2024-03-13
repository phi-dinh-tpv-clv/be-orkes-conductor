import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsTitleLength(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTitleLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max], // Add your min and max values here
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [min, max] = args.constraints;
          return value.length >= min && value.length <= max;
        },
        defaultMessage() {
          return `The title must be between ${min} and ${max} characters`;
        },
      },
    });
  };
}

export class CreatePostDto {
  @IsString()
  @ApiProperty({
    name: 'content',
    example: 'content example',
  })
  content: string;

  @IsString()
  @ApiProperty({
    name: 'title',
    example: 'title example',
  })
  @IsTitleLength(8, 100)
  title: string;

  @ApiPropertyOptional()
  author: number;

  @ApiPropertyOptional({ type: 'object' })
  meta: Record<string, unknown>;
}

export default CreatePostDto;
