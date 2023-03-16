import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  public async hash(value: string): Promise<string> {
    return await argon2.hash(value);
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, value);
  }
}
