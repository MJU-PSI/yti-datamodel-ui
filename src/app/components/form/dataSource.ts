// import { IPromise } from 'angular';

export interface DataSource<T> {
  (search: string): Promise<T[]>;
}
