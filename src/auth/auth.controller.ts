import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginLocalDto } from './dto/loginLocal.dto';
import { RegisterLocalDto } from './dto/registerLocal.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/local')
  registerLocal(@Body() registerLocalDto: RegisterLocalDto) {
    return this.authService.registerLocal(registerLocalDto);
  }

  @Post('login/local')
  loginLocal(@Body() loginLocalDto: LoginLocalDto) {
    return this.authService.loginLocal(loginLocalDto);
  }
}
