import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from '@aws-sdk/client-dynamodb';

export class DynamoDBClientV3 extends AWS.DynamoDBClient {}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DynamoDBClientV3,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new AWS.DynamoDBClient({
          region: configService.get('AWS_REGION'),
          endpoint: configService.get('AWS_ENDPOINT_URL'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
    },
  ],
  exports: [DynamoDBClientV3],
})
export class DynamoDBClientModuleV3 {}
