import {ImmutableObject} from 'seamless-immutable';

export interface Config{
  apiKey: string;
}

export type IMConfig = ImmutableObject<Config>;