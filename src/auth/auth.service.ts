import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginLocalDto } from './dto/loginLocal.dto';
import { HashService } from 'src/hash/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashSerice: HashService,
    private readonly jwtService: JwtService,
  ) {}

  public registerLocal(registerLocalDto: LoginLocalDto) {
    return this.userService.create(registerLocalDto);
  }

  public async loginLocal(loginLocalDto: LoginLocalDto) {
    let user: { id: number; password: string };
    try {
      user = await this.userService.findByEmail(loginLocalDto.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.hashSerice.compare(
      loginLocalDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.password;
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  public getConnectedUser(userId) {
    return this.userService.findOne(userId);
  }
}
