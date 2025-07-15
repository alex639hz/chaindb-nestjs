/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TxController } from './tx.controller';
import { TxService } from './tx.service';
import { TxSchema } from './schemas/tx.schema';
import { CryptoService } from '../crypto/crypto.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tx', schema: TxSchema }]),
  ],
  controllers: [TxController],
  providers: [TxService, CryptoService],
})
export class TxModule { }
