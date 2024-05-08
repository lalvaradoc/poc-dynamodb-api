import { Injectable } from '@nestjs/common';
import { DynamoDBClientV2 } from './dynamo-clientv2.module';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AppServiceV2 {
  constructor(private dynamoDBClient: DynamoDBClientV2) {}
  async create(): Promise<any> {
    const result = await this.dynamoDBClient
      .put({
        TableName: 'contenido-sindicado',
        Item: {
          contentId: uuid(),
          identifiers: ['Samsung', '1234'],
          content: '<div>some content</div>',
          provider: '',
          metadata: {
            brand: '',
            modelo: '',
            modelo_fabricante: '',
            product_sku: '',
            data_brand: {},
          },
        },
      })
      .promise();
    return result;
  }
  async getAll(): Promise<any> {
    const results = await this.dynamoDBClient
      .scan({
        TableName: 'contenido-sindicado',
      })
      .promise();

    return results.Items;
  }
  async filter(brand?: string, category?: string): Promise<any> {
    const result = await this.dynamoDBClient
      .scan({
        TableName: 'contenido-sindicado',
        FilterExpression:
          'contains(#identifiers, :categoria) or contains(#identifiers, :marca)',
        ExpressionAttributeNames: {
          '#identifiers': 'identifiers',
        },
        ExpressionAttributeValues: {
          ':categoria': '4',
          ':marca': '1',
        },
      })
      .promise();
    console.log(result);
    return result.Items;
  }

  async update(contentId: string): Promise<any> {
    const result = await this.dynamoDBClient
      .update({
        TableName: 'contenido-sindicado',
        Key: { contentId },
        UpdateExpression:
          'set brand = :brand, model = :model, content = :content',
        ExpressionAttributeValues: {
          ':brand': 'Apple',
          ':model': 'Iphone 15',
          ':content': '<div>another content</div>',
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return result.Attributes;
  }

  async remove(contentId: string): Promise<any> {
    return await this.dynamoDBClient
      .delete({
        TableName: 'contenido-sindicado',
        Key: { contentId },
      })
      .promise();
  }
}
