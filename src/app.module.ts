import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppServiceV2 } from './app.servicev2';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBClientModuleV2 } from './dynamo-clientv2.module';
import { DynamoDBClientModuleV3 } from './dynamo-clientv3.module';
import { AppServiceV3 } from './app.servicev3';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env.development.local', '.env.development.local'],
    }),
    DynamoDBClientModuleV3,
  ],
  controllers: [AppController],
  providers: [AppServiceV3],
})
export class AppModule {}
