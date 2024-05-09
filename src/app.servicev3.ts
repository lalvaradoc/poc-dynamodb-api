import { Injectable } from '@nestjs/common';
import { DynamoDBClientV3 } from './dynamo-clientv3.module';
import { items as contentItems } from './data2.json';
import { ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class AppServiceV3 {
  constructor(private dynamoDBClient: DynamoDBClientV3) {}
  async create() {
    for (let contentItem of contentItems) {
      const putCommand = new PutCommand({
        TableName: 'syndicated-content',
        Item: {
          ...contentItem,
        },
      });
      await this.dynamoDBClient.send(putCommand);
    }
    return 'contents created';
  }

  async getAll() {
    const input = {
      TableName: 'syndicated-content',
    };
    const scanCommand = new ScanCommand(input);
    const result = await this.dynamoDBClient.send(scanCommand);
    return result.Items;
  }

  async filter(brand: string = '', category: string = '') {
    const input = {
      TableName: 'syndicated-content',
      FilterExpression: '#identifier = :category or #identifier = :brand',
      ExpressionAttributeNames: {
        '#identifier': 'identifier',
      },
      ExpressionAttributeValues: {
        ':category': category,
        ':brand': brand,
      },
    };
    const scanCommand = new ScanCommand(input);
    const result = await this.dynamoDBClient.send(scanCommand);
    return result.Items;
  }

  async getByIdentifier(brand: string = '', category: string = '') {
    const getByBrandCommand = new GetCommand({
      TableName: 'syndicated-content',
      Key: {
        identifier: brand,
      },
    });
    const brandResult = await this.dynamoDBClient.send(getByBrandCommand);
    if (!brandResult.Item) {
      const getByCategoryCommand = new GetCommand({
        TableName: 'syndicated-content',
        Key: {
          identifier: category,
        },
      });
      const categoryResult =
        await this.dynamoDBClient.send(getByCategoryCommand);
      return categoryResult.Item;
    }
    return brandResult.Item;
  }

  async update(contentId: string) {}

  async remove(contentId: string) {}
}
