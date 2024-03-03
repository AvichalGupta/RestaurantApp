import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { LoginServiceService } from './login-service.service';
import {
  ILoginPayload,
  ISignUpPayload,
  loginAPISchema,
  signupAPISchema,
} from './login-service.interface';
import { LoginServicePipe } from './login-service.pipe';
import { UtilityService } from 'src/utility/utility.service';

@Controller({
  path: 'auth',
})
export class LoginServiceController {
  constructor(
    private loginService: LoginServiceService,
    private utils: UtilityService,
  ) {}

  @Post('/login')
  @UsePipes(new LoginServicePipe(loginAPISchema))
  public async loginController(@Body() payload: ILoginPayload, @Res() res) {
    try {
      const loginApiResponse = await this.loginService.login(payload);
      return this.utils.handleSuccessResponse(res, loginApiResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Post('/signup')
  @UsePipes(new LoginServicePipe(signupAPISchema))
  public signupController(@Body() payload: ISignUpPayload, @Res() res) {
    try {
      const signupApiResponse = this.loginService.signup(payload);
      return this.utils.handleSuccessResponse(res, signupApiResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }
}
