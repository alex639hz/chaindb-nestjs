import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TxModule } from './tx.module';
// import { TxService } from './tx.service';
import { INestApplication } from '@nestjs/common';

describe('TX', () => {
  let app: INestApplication;
  // const txService: TxService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TxModule],
    })
      // .overrideProvider(TxService)
      // .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`GET /tx`, () => {
    return request(app.getHttpServer()).get('/tx').expect(200).expect({
      // data: txService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
