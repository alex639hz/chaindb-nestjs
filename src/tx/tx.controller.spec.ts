/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { TxController } from './tx.controller';
import { TxService } from './tx.service';
import { CreateTxDto } from './dto/create-tx.dto';
import { CryptoService } from '../crypto/crypto.service';

describe('TxController', () => {
  let txController: TxController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TxController],
      providers: [TxService, CryptoService],
    }).compile();

    txController = app.get<TxController>(TxController);
  });

  describe('root', () => {
    it('should create tx', () => {
      const tx: CreateTxDto = {
        tx: {
          sender: 'A123',
          receiver: 'A456',
          amount: 100,
        },
      };
      expect(txController.createTx(tx)).toHaveProperty('_id');
    });
  });
});
