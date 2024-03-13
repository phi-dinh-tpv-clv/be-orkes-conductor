import { ApiProperty } from '@nestjs/swagger';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export class TokensSchema implements Tokens {
  @ApiProperty({
    name: 'access_token',
  })
  access_token: string;

  @ApiProperty({
    name: 'refresh_token',
  })
  refresh_token: string;
}
