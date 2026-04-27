import "dotenv/config";
import {
  Injectable, CanActivate, ExecutionContext, UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientPwd = request.headers['X-Band-Password'];
    const serverPwd = process.env.APP_PASSWORD;

    if (!serverPwd || clientPwd !== serverPwd) {
      throw new UnauthorizedException('Zugriff verweigert');
    }
    return true;
  }
}