import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { GetPostParams } from './dto/getPost.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { InjectUserToParam } from 'src/common/decorators/inject-user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Public()
  @Get('get-post')
  @InjectUserToParam()
  getPostWithUser(@Param() params: GetPostParams): string {
    // by pass eslint
    console.log('params', params);
    return 'Edit action';
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }
}
