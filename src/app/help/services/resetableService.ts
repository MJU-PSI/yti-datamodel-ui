// import { IPromise } from 'angular';

// export interface ResetableService {
//   reset(): IPromise<any>;
// }


export interface ResetableService {
  reset(): Promise<any>;
}
