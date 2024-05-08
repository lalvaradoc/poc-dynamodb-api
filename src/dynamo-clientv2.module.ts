import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export class DynamoDBClientV2 extends AWS.DynamoDB.DocumentClient {}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DynamoDBClientV2,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new AWS.DynamoDB.DocumentClient({
          region: configService.get('AWS_REGION'),
          endpoint: configService.get('AWS_ENDPOINT_URL'),
          accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        });
      },
    },
  ],
  exports: [DynamoDBClientV2],
})
export class DynamoDBClientModuleV2 {}
