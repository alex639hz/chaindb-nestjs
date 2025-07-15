import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TxModule } from './tx/tx.module';

// import
@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'),
    TxModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
