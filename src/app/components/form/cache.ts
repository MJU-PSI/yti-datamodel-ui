import { Model } from 'app/entities/model';

export function modelScopeCache<T>(modelProvider: () => Model, dataProvider: (model: Model) => Promise<T>): () => Promise<T> {

  let cachedResult: Promise<T>;
  let previousModel: Model;

  return () => {

    const model = modelProvider();

    if (!cachedResult || model !== previousModel) {
      cachedResult = dataProvider(model);
      previousModel = model;
    }

    return cachedResult;
  };
}
