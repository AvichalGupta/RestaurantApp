import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CommonErrorMessages,
  StandardSuccessResponse,
} from './utility.interface';
import {
  LoginErrorResponse,
  Roles,
} from 'src/login-service/login-service.interface';

@Injectable()
export class UtilityService {
  private getErrorStatusCode(errorMessage: string) {
    switch (errorMessage) {
      case LoginErrorResponse.LF1:
        return 400;
      case LoginErrorResponse.LF2:
        return 400;
      case LoginErrorResponse.LF3:
        return 400;
      case LoginErrorResponse.LF4:
        return 400;
      case LoginErrorResponse.LF5:
        return 400;
      case LoginErrorResponse.LF6:
        return 400;
      case LoginErrorResponse.LF7:
        return 400;
      case LoginErrorResponse.LF8:
        return 400;
      default:
        return 500;
    }
  }
  public handleSuccessResponse(res: any, data: StandardSuccessResponse) {
    const responseObj = {
      statusCode: data.statusCode || HttpStatus.OK,
      message: data.statusMessage,
      data: data.data,
    };
    return res.status(responseObj.statusCode).send(responseObj);
  }

  public handleFailureResponse(res: any, errorResponse: any) {
    const responseObj = {
      statusCode:
        this.getErrorStatusCode(errorResponse.message) ||
        HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage:
        (errorResponse?.length > 0 ? errorResponse : errorResponse.message) ||
        CommonErrorMessages.SE1,
    };
    return res.status(responseObj.statusCode).send(responseObj);
  }

  public checkPermission(endpoint: string, userRole: string): boolean {
    switch (userRole) {
      case Roles.admin:
        break;
      case Roles.bo:
        if (
          endpoint.includes('listing/remove') ||
          endpoint.includes('review/add') ||
          endpoint.includes('review/delete')
        )
          return false;
        break;
      case Roles.user:
        if (
          endpoint.includes('listing/remove') ||
          endpoint.includes('listing/create') ||
          endpoint.includes('listing/modify')
        )
          return false;
        break;
      default:
        throw new Error(LoginErrorResponse.LF9);
    }
    return true;
  }

  public getParsedData(data: string): Record<string, any> {
    try {
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (err) {
      throw new Error(CommonErrorMessages.SE1);
    }
  }
}
