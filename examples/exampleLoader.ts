/// <reference types="node" />

import { ILogCall, ILogService, IQService } from 'angular';
import { EntityLoader } from '../src/services/entityLoader';
import { httpService } from './requestToAngularHttpService';
import { DefaultPredicateService } from '../src/services/predicateService';
import { DefaultModelService } from '../src/services/modelService';
import { DefaultClassService } from '../src/services/classService';
import { DefaultVocabularyService } from '../src/services/vocabularyService';
import { FrameService } from '../src/services/frameService';

const argv = require('optimist')
  .default({
    host: 'localhost',
    port: 8084
  })
  .argv;

process.env['API_ENDPOINT'] = `http://${argv.host}:${argv.port}/api`;

const logFn: ILogCall = (...args: any[]) => console.log(args);
const log: ILogService = { debug: logFn, error: logFn, info: logFn, log: logFn, warn: logFn };
const q = <IQService> require('q');
const frameService = new FrameService(log);
const modelService = new DefaultModelService(httpService, q, frameService);
const predicateService = new DefaultPredicateService(httpService, q, frameService);
const classService = new DefaultClassService(httpService, q, predicateService, frameService);
const vocabularyService = new DefaultVocabularyService(httpService, q, frameService);

const context = {
  'skos' : 'http://www.w3.org/2004/02/skos/core#',
  'dc' : 'http://purl.org/dc/elements/1.1/',
  'schema' : 'http://schema.org/',
  'foaf' : 'http://xmlns.com/foaf/0.1/'
};


export const loader = new EntityLoader(q, modelService, predicateService, classService, vocabularyService, context);
