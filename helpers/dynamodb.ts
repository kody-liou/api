// # sourceMappingURL=dynamodb.js.map

import { nanoid } from 'nanoid';
import microtime from 'microtime';
import {
  DynamoDB,
  QueryCommand,
  QueryCommandInput,
  DeleteItemCommand,
  DeleteItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import createError from 'http-errors';
import { PartialNull } from '../types/common';

type Item = {
  [key: string]: AttributeValue;
};

/**
 * CommonDBItem includes attributes that exist every item
 * @param PK user#${userId}
 * @param SK ${type}#${ts}
 * @param GS1PK ${type}#${typeId}
 * @param ts time stamp
 * */
export type CommonDBItem = {
  /** user#${userId} */
  PK: { S: string };
  /** ${type}#${ts} */
  SK: { S: string };
  /** ${type}#${typeId} */
  GS1PK: { S: string };
  GS2PK?: { S: string };
  GS3PK?: { S: string };
  /** time stamp */
  ts: { N: string };
};

type DBItem = CommonDBItem & Item;

export const docClient = new DynamoDB({ region: process.env.REGION! });

const queryByPK = (userId: string) => {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    KeyConditionExpression: '#PK = :PK AND #SK BETWEEN :SK1 AND :SK2',
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    },
    ExpressionAttributeValues: {
      ':PK': { S: `user#${userId}` },
      ':SK1': { S: `file#1642256976124000` },
      ':SK2': { S: `file#1652256976124002` },
    },
    ScanIndexForward: false,
    Limit: 2,
  };
  const command = new QueryCommand(params);
  return docClient.send(command);
};

export const indexByPK = async <T extends DBItem>(userId: string) => {
  const data = await queryByPK(userId);
  if (!data.Items) return null;
  return data.Items as T[];
};

const queryByGS1PK = async (GS1PK: string, userId?: string) => {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    IndexName: 'GS1PK-index',
    KeyConditionExpression: 'GS1PK = :gs1pk',
    ExpressionAttributeValues: {
      ':gs1pk': { S: GS1PK },
    },
    ScanIndexForward: false,
  };
  if (userId) {
    params.FilterExpression = 'PK = :pk';
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ':pk': { S: `user#${userId}` },
    };
  }
  const command = new QueryCommand(params);
  return docClient.send(command);
};

const queryByGS2PK = async (GS2PK: string, userId?: string) => {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    IndexName: 'GS2PK-index',
    KeyConditionExpression: 'GS2PK = :gs2pk',
    ExpressionAttributeValues: {
      ':gs2pk': { S: GS2PK },
    },
    ScanIndexForward: false,
  };
  if (userId) {
    params.FilterExpression = 'PK = :pk';
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ':pk': { S: `user#${userId}` },
    };
  }
  const command = new QueryCommand(params);
  return docClient.send(command);
};

export const getByGS1PK = async <T extends DBItem>(
  GS1PK: string,
  userId?: string,
) => {
  const data = await queryByGS1PK(GS1PK, userId);
  if (!data.Items) return null;
  return data.Items.length > 0
    ? (data.Items[data.Items.length - 1] as T)
    : null;
};
export const getByGS2PK = async <T extends DBItem>(
  GS2PK: string,
  userId?: string,
): Promise<DBItem | null> => {
  const data = await queryByGS2PK(GS2PK, userId);
  if (!data.Items) return null;
  return data.Items.length > 0
    ? (data.Items[data.Items.length - 1] as T)
    : null;
};

export const indexByGS2PK = async <T extends DBItem>(
  GS2PK: string,
  userId?: string,
): Promise<DBItem[] | null> => {
  const data = await queryByGS2PK(GS2PK, userId);
  return (data.Items as T[]) || null;
};

export enum DBResourceType {
  profile = 'profile',
  file = 'file',
}

export const indexByType = async <T extends DBItem>(
  userId: string,
  type: DBResourceType,
): Promise<DBItem[] | null> => {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    KeyConditionExpression: 'PK = :userId and begins_with(SK, :type)',
    ExpressionAttributeValues: {
      ':userId': { S: `user#${userId}` },
      ':type': { S: type },
    },
    ScanIndexForward: false,
  };
  const data = await docClient.send(new QueryCommand(params));
  return (data.Items as T[]) || null;
};

export const getByTypeAndTypeId = async <T extends DBItem>(
  type: DBResourceType,
  typeId: string,
  userId?: string,
): Promise<T | null> =>
  getByGS1PK(`${type}#${typeId}`, userId) as Promise<T | null>;

export const deleteByTypeAndTypeId = async <T extends DBItem>(
  type: DBResourceType,
  typeId: string,
  userId?: string,
): Promise<T | null> => {
  const item = await getByTypeAndTypeId<T>(type, typeId, userId);
  if (!item) {
    return null;
  }
  const params: DeleteItemCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    Key: {
      PK: item.PK,
      SK: item.SK,
    },
    ConditionExpression: 'GS1PK = :gs1pk',
    ExpressionAttributeValues: {
      ':gs1pk': item.GS1PK,
    },
  };
  await docClient.send(new DeleteItemCommand(params));
  return item;
};

export type Overrides = {
  id?: string;
  ts?: number;
};

type CreateOrUpdateItemArg<T extends DBItem> = {
  userId: string;
  type: DBResourceType;
  GS1PK?: string | null;
  GS2PK?: string | null;
  GS3PK?: string | null;
  data: PartialNull<T>;
  attrOverrides?: Overrides;
};

export type CreateOrUpdateReturn<T extends DBItem> = {
  existing: boolean;
  newItem: T;
};

/** Create new item */
const createItem = async <T extends DBItem>({
  userId,
  type,
  data,
  GS1PK,
  GS2PK,
  GS3PK,
  attrOverrides,
}: CreateOrUpdateItemArg<T>): Promise<T> => {
  const id = attrOverrides?.id || nanoid();
  const ts: number = attrOverrides?.ts || microtime.now();
  const PK = `user#${userId}`;
  const SK = `${type}#${ts}`;
  const newItem: T = {
    ...data,
    PK: { S: PK },
    SK: { S: SK },
    GS1PK: { S: GS1PK || `${type}#${id}` },
    ts: { N: ts.toString() },
  } as T;
  if (GS2PK) newItem.GS2PK = { S: GS2PK };
  if (GS3PK) newItem.GS3PK = { S: GS3PK };
  const params: PutItemCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    Item: newItem,
    ConditionExpression: '#kPK <> :vPK AND #kSK <> :vSK',
    ExpressionAttributeNames: { '#kPK': 'PK', '#kSK': 'SK' },
    ExpressionAttributeValues: { ':vPK': { S: PK }, ':vSK': { S: SK } },
  };
  await docClient.send(new PutItemCommand(params));
  return newItem;
};

type UpdateItemArg<T extends DBItem> = {
  PK: string;
  SK: string;
  data: PartialNull<T>;
  GS1PK?: string | null;
  GS2PK?: string | null;
  GS3PK?: string | null;
};

const updateItem = async <T extends DBItem>({
  PK,
  SK,
  data,
  GS1PK,
  GS2PK,
  GS3PK,
}: UpdateItemArg<T>): Promise<T | undefined> => {
  const setOperations: string[] = [];
  const removeOperations: string[] = [];
  const updateKeys = {};
  const updateValues = {};
  const updateObject = { ...data, GS1PK, GS2PK, GS3PK };
  Object.keys(updateObject).forEach((key, idx) => {
    if (updateObject[key] === undefined) return;
    const keyPlaceholder = `#k${idx}`;
    const valuePlaceholder = `:v${idx}`;
    if (updateObject[key] === null) {
      removeOperations.push(keyPlaceholder);
      updateKeys[keyPlaceholder] = key;
      return;
    }
    setOperations.push(`${keyPlaceholder} = ${valuePlaceholder}`);
    updateKeys[keyPlaceholder] = key;
    updateValues[valuePlaceholder] = updateObject[key];
  });
  let updateExpression = '';
  if (setOperations.length > 0) {
    updateExpression += `set ${setOperations.join(', ')} `;
  }
  if (removeOperations.length > 0) {
    updateExpression += `remove ${removeOperations.join(', ')}`;
  }
  if (updateExpression === '') return;
  const params: UpdateItemCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
    Key: {
      PK: { S: PK },
      SK: { S: SK },
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: updateKeys,
    ExpressionAttributeValues:
      Object.keys(updateValues).length === 0 ? undefined : updateValues,
    ReturnValues: 'ALL_NEW',
  };
  const updatedAttributes = await docClient.send(new UpdateItemCommand(params));
  return updatedAttributes.Attributes as T | undefined;
};
export const createOrUpdateItem = async <T extends DBItem>({
  userId,
  type,
  GS1PK,
  GS2PK,
  GS3PK,
  data,
  attrOverrides,
}: CreateOrUpdateItemArg<T>): Promise<CreateOrUpdateReturn<T>> => {
  const idOverride = attrOverrides?.id;
  if (idOverride) {
    const existingItem = await getByTypeAndTypeId<T>(type, idOverride);
    if (existingItem) {
      const {
        PK: { S: PK },
        SK: { S: SK },
      } = existingItem;
      const existingUserId = PK.split('#')[1];
      // Existing record found but user id mismatch.
      // Treat as if it does not exist.
      if (existingUserId !== userId) {
        await deleteByTypeAndTypeId(type, idOverride, existingUserId);
      } else {
        const updatedItem = await updateItem<T>({
          PK,
          SK,
          data,
          GS1PK,
          GS2PK,
          GS3PK,
        });
        return {
          existing: true,
          newItem: updatedItem ?? existingItem,
        };
      }
    }
  }
  const newItem = await createItem({
    userId,
    type,
    data,
    GS1PK,
    GS2PK,
    GS3PK,
    attrOverrides,
  });
  return {
    existing: false,
    newItem,
  };
};

export abstract class CommonDBModel<
  ClientEditableData,
  ClientData,
  DBData extends CommonDBItem,
> {
  userId: string;

  abstract type: DBResourceType;

  id?: string;

  constructor(userId: string, id?: string) {
    this.userId = userId;
    this.id = id;
  }

  abstract clientEditableDataFilter(data: any): ClientEditableData;

  abstract clientDataFilter(data: any): ClientData;

  async getById(): Promise<ClientData | null> {
    if (!this.id) {
      throw new createError.BadRequest(`Bad Request: Invalid ${this.type} ID`);
    }
    const item = await getByTypeAndTypeId<DBData>(
      this.type,
      this.id,
      this.userId,
    );
    if (!item) {
      throw new createError.NotFound();
    }
    return this.clientDataFilter(item);
  }

  async indexByUser(): Promise<ClientData[]> {
    const items = await indexByType<DBData>(this.userId, this.type);
    return items?.map((item) => this.clientDataFilter(item)) ?? [];
  }

  createOrUpdate(
    data: PartialNull<DBData>,
  ): Promise<CreateOrUpdateReturn<DBData>> {
    return createOrUpdateItem<DBData>({
      userId: this.userId,
      type: this.type,
      data,
      attrOverrides: {
        id: this.id,
      },
    });
  }

  async deleteItem() {
    if (!this.id) throw new createError.BadRequest(`No ${this.type} Id`);
    const result = await deleteByTypeAndTypeId(this.type, this.id, this.userId);
    if (!result) throw new createError.NotFound();
  }
}
