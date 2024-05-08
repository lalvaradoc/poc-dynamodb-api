import { Injectable } from '@nestjs/common';
import { DynamoDBClientV3 } from './dynamo-clientv3.module';
import { ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { items as contentItems } from './data.json';
import { v4 as uuid } from 'uuid';
import { String } from 'aws-sdk/clients/cloudsearchdomain';

@Injectable()
export class AppServiceV3 {
  constructor(private dynamoDBClient: DynamoDBClientV3) {}
  async create() {
    for (let contentItem of contentItems) {
      const putCommand = new PutItemCommand({
        TableName: 'contenido-sindicado',
        Item: {
          contentId: { S: uuid() },
          ...marshall(contentItem),
        },
      });
      await this.dynamoDBClient.send(putCommand);
    }
    return 'contents created';
  }
  async getAll() {
    try {
      const input = {
        TableName: 'contenido-sindicado',
      };
      const scanCommand = new ScanCommand(input);
      const result = await this.dynamoDBClient.send(scanCommand);
      return result.Items.map((item) => unmarshall(item));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async filter(brand: string = '', category: String = '') {
    const input = {
      TableName: 'contenido-sindicado',
      FilterExpression:
        'contains(#identifiers, :category) or contains(#identifiers, :brand)',
      ExpressionAttributeNames: {
        '#identifiers': 'identifiers',
      },
      ExpressionAttributeValues: {
        ':category': { S: category },
        ':brand': { S: brand },
      },
    };
    const scanCommand = new ScanCommand(input);
    const result = await this.dynamoDBClient.send(scanCommand);
    return result.Items.map((item) => unmarshall(item));
  }

  async update(contentId: string) {}

  async remove(contentId: string) {}
}
