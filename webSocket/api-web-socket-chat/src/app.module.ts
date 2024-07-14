import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebscoketModule } from './websocket/websocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    WebscoketModule,
    MongooseModule.forRoot(
      'mongodb+srv://prosemdev:qwer45152@reservepro.chlczpb.mongodb.net/reservePro',
    ),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
