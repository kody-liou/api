import { Gender } from './generated/types/gender';

export enum DBItemType {
  profile = 'profile',
  file = 'file',
}
/**
 * @param PK `user#${userId}`
 * @param SK `${DBItemType}#${ts}`
 * */
export type CommonDBItem = {
  PK: { S: string };
  SK: { S: string };
};

/**
 * @param GS1PK `profile-${Gender}${dob:yyyyMM}`
 * @param GS1SK `${score}${ts:lastEditTime}`
 * */
export type ProfileDBItem = {
  score: { N: string };
  name: { S: string };
  age: { N: string };
  gender: Gender;
  isAgeDisplay: { B: string };
  prefereGender: { S: string };
} & CommonDBItem;

export type FileDBItem = {} & CommonDBItem;
