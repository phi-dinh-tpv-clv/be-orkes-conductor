import { Injectable, PipeTransform } from '@nestjs/common';
import { omit } from 'lodash';
import { REQUEST_CONTEXT } from '../interceptors/inject-users.interceptor';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  transform(value: any) {
    return omit(value, REQUEST_CONTEXT);
  }
}
