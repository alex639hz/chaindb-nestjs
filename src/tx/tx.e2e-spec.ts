import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // it('/ (GET) - should return "Hello World!"', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });


  it('/ (GET) - should return "100"', () => {
    return request(app.getHttpServer())
      .get('/tx/system-balance')
      .expect(200)
      .expect((res) => {
        expect(res.text).toBe('100');
      });
  });

  it('/ (GET) - should return 5', () => {
    return request(app.getHttpServer())
      .get('/tx/balance?address=K4xY7')
      .expect(200)
      .expect((res) => {
        const tx = JSON.parse(res.text);
        expect(tx.fetchedBalance.totalBalanceAcc.totalBalance).toBe(5);
      });
  });

  // Example for a POST request
  // it('/users (POST) - should create a new user', async () => {
  //   const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send(newUser)
  //     .expect(201); // Expect a 201 Created status

  //   expect(response.body).toHaveProperty('id');
  //   expect(response.body.name).toBe(newUser.name);
  //   expect(response.body.email).toBe(newUser.email);
  // });
});
