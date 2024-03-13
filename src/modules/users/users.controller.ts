import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/createUser.dto';
import User from './entity/user.entity';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  findOneUserById(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Post()
  @ApiResponse({
    description: 'Response what return',
    type: User,
  })
  createUsre(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
}
