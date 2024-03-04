import { Injectable } from '@nestjs/common';
import {
  ILoginPayload,
  ISignUpPayload,
  JWTPayload,
  LoginErrorResponse,
  Roles,
  userSchema,
} from './login-service.interface';
import * as fs from 'fs';
import { join } from 'path';
import {
  CommonErrorMessages,
  StandardSuccessResponse,
} from 'src/utility/utility.interface';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UtilityService } from 'src/utility/utility.service';

@Injectable()
export class LoginServiceService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private utils: UtilityService,
  ) {}

  private hashPassword(password: string): string {
    const saltRounds = +this.configService.get('HASH_SALT') || 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  private comparePasswords(
    passwordEntered: string,
    passwordFromDB: string,
  ): boolean {
    if (!passwordFromDB) throw new Error(LoginErrorResponse.LF3);
    return bcrypt.compareSync(passwordEntered, passwordFromDB);
  }

  private async createJWTToken(email: string, userRole: Roles) {
    const payload: JWTPayload = {
      email,
      userRole: !userRole ? Roles.user : userRole,
    };

    return await this.jwtService.signAsync(payload);
  }

  public async verifyToken(token: string): Promise<JWTPayload> {
    if (!token) throw new Error(LoginErrorResponse.LF5);

    try {
      const verificationResponse: JWTPayload =
        await this.jwtService.verifyAsync(token);
      const filePath = join(process.cwd(), '/src/sample-db/users.json');
      const fileData = fs.readFileSync(filePath, 'utf-8');
      if (!fileData.length) {
        throw new Error(LoginErrorResponse.LF10);
      }

      const parsedDataFromFile: Record<string, userSchema> =
        this.utils.getParsedData(fileData);

      if (
        !parsedDataFromFile[verificationResponse.email] ||
        parsedDataFromFile[verificationResponse.email].authToken !== token ||
        parsedDataFromFile[verificationResponse.email].role !==
          verificationResponse.userRole
      ) {
        throw new Error(LoginErrorResponse.LF10);
      }
      return verificationResponse;
    } catch (err) {
      if (err.message == 'jwt expired') throw new Error(LoginErrorResponse.LF7);
      if (err == LoginErrorResponse.LF10)
        throw new Error(LoginErrorResponse.LF10);
      throw new Error(LoginErrorResponse.LF6);
    }
  }

  public async login(payload: ILoginPayload): Promise<StandardSuccessResponse> {
    const { email, password } = payload;
    const filePath = join(process.cwd(), '/src/sample-db/users.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    if (!fileData.length) {
      throw new Error(LoginErrorResponse.LF1);
    }

    const parsedDataFromFile: Record<string, userSchema> =
      this.utils.getParsedData(fileData);

    if (!parsedDataFromFile[email]) {
      throw new Error(LoginErrorResponse.LF1);
    }

    const { password: passwordFromDB, role: userRole } =
      parsedDataFromFile[email];

    const doesPasswordMatch = this.comparePasswords(password, passwordFromDB);

    if (!doesPasswordMatch) {
      throw new Error(LoginErrorResponse.LF2);
    }

    // create JWT token using email and role information
    const JWTToken = await this.createJWTToken(email, userRole);

    try {
      parsedDataFromFile[email] = {
        password: passwordFromDB,
        role: userRole,
        authToken: JWTToken,
      };
      const stringifiedFileData: string = JSON.stringify(parsedDataFromFile);
      fs.writeFileSync(filePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Login Successfull!',
        data: {
          token: JWTToken,
        },
      };
    } catch (err) {
      console.error('Error while signing up new user: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }

  public signup(payload: ISignUpPayload): StandardSuccessResponse {
    const { email, password, role } = payload;

    const filePath = join(process.cwd(), '/src/sample-db/users.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    let parsedDataFromFile: Record<string, userSchema>;

    if (fileData.length) {
      parsedDataFromFile = this.utils.getParsedData(fileData);

      if (parsedDataFromFile[email]) {
        throw new Error(LoginErrorResponse.LF8);
      }
    }

    const existingFileData = parsedDataFromFile;

    existingFileData[email] = {
      password: this.hashPassword(password),
      role,
      authToken: '',
    };

    const stringifiedFileData: string = JSON.stringify(existingFileData);

    try {
      fs.writeFileSync(filePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'User Signed Up Successfully! Please login to continue.',
        data: {},
      };
    } catch (err) {
      console.error('Error while signing up new user: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }
}
