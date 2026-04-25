import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่านเพื่อรับ JWT Token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
