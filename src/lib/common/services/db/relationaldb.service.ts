import { Inject, Injectable } from "@decorators/di";

import { Logger, StdLogger } from "../../../../lib/loggers";

import joinJs from 'join-js';

interface InsertData {
  tableName: string,
  entity: object
}

interface UpdateData {
  tableName: string,
  where: any,
  entity: object
}

interface DeleteData {
  tableName: string,
  where: any
}

@Injectable()
export default class RelationalDbService {

  client: any;

  constructor(
    @Inject(StdLogger) private logger: Logger
  ){
    this.client = null
  }

  objectMapper(){
    return joinJs;
  }

  insert(data: InsertData): Promise<any> {
    return Promise.reject(Error('not implemented'));
  }

  update(data: UpdateData): Promise<any> {
    return Promise.reject(Error('not implemented'));
  }

  delete(data: DeleteData): Promise<any> {
    return Promise.reject(Error('not implemented'));
  }

  sqlQuery(queryString: string): Promise<any> {
    return Promise.reject(Error('not implemented'));
  }

  fromTable(name: string): Promise<any> {
    return Promise.reject(Error('not implemented'));
  }

  transaction(cb: (trx: any) => void): any | Promise<{}>{
    return Promise.reject(Error('not implemented'));
  }

};