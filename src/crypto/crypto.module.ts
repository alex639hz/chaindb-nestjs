/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';


@Module({
  imports: [],
  controllers: [],
  providers: [CryptoService],
})

export class CryptoModule { }
