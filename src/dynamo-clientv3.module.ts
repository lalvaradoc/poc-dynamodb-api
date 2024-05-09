import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoDBClientV3 extends DynamoDBDocumentClient {}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DynamoDBClientV3,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const client = new AWS.DynamoDBClient({
          region: configService.get('AWS_REGION'),
          endpoint: configService.get('AWS_ENDPOINT_URL'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [DynamoDBClientV3],
})
export class DynamoDBClientModuleV3 {}
