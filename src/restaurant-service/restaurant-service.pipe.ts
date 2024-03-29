import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class RestaurantServicePipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any) {
    if (value.images || (value && !Object.keys(value).length)) return value;
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.message.replace(/"/g, ''));
    }
    return value;
  }
}
