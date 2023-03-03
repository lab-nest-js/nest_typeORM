import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const post = await this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({
      id,
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const updatedPost = await this.postRepository.update(id, updatePostDto);
    if (!updatedPost.affected) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return await this.postRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    const deletedPost = await this.postRepository.delete(id);
    if (!deletedPost.affected) {
      throw new InternalServerErrorException("Post couldn't be deleted");
    }
    return post;
  }
}
