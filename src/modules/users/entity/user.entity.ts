import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Primary key as Option ID',
    example: 1,
  })
  public id?: number;

  @ApiProperty({
    description: 'Name of user',
    example: 'Otter Otwel',
  })
  @Column({ unique: true })
  public email: string;

  @ApiProperty({
    description: 'Email of user',
    example: 'otterotwel@gmail.com',
  })
  @Column()
  public name: string;

  @ApiProperty({
    description: 'Password of user',
    example: 'string',
  })
  @Column()
  public password: string;

  @Exclude()
  @ApiProperty({
    description: 'Refresh token of user',
    example: 'string',
  })
  @Column({
    nullable: true,
  })
  public refresh_token?: string;
}

export default User;
