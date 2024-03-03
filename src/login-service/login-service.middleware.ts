import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JWTPayload, LoginErrorResponse } from './login-service.interface';
import { LoginServiceService } from './login-service.service';
import { UtilityService } from 'src/utility/utility.service';

@Injectable()
export class LoginServiceMiddleware implements NestMiddleware {
  constructor(
    private loginService: LoginServiceService,
    private utils: UtilityService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    const headers = req.headers;
    if (!headers['x-auth-token']) {
      throw new HttpException(LoginErrorResponse.LF5, HttpStatus.UNAUTHORIZED);
    }
    const authToken = headers['x-auth-token'];
    const { email, userRole }: JWTPayload =
      await this.loginService.verifyToken(authToken);
    req.body.userEmail = email;
    req.body.userRole = userRole;
    const endpoint = req.route.path;
    const canUserAccessResource: boolean = this.utils.checkPermission(
      endpoint,
      userRole,
    );
    if (!canUserAccessResource) throw new Error(LoginErrorResponse.LF9);
    next();
  }
}
