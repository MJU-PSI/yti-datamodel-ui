import { isDefined } from 'yti-common-ui/utils/object';
import { normalizeAsArray, filterDefined } from 'yti-common-ui/utils/array';
import Moment = moment.Moment;
import * as moment from 'moment';
import { Coordinate  } from 'app/types/visualization';
import { Language } from 'app/types/language';
import { Type } from 'app/types/entity';
import { mapType, reverseMapType } from 'app/utils/entity';
import { Localizable } from 'yti-common-ui/types/localization';

export interface Serializer<T> {
  type: 'Normal';
  serialize(data: T): any;
  deserialize(data: any): T;
}

export function createSerializer<T>(serialize: (data: T) => any, deserialize: (data: any) => T): Serializer<T> {
  return {
    type: 'Normal',
    serialize,
    deserialize
  };
}

export function identitySerializer<T>(): Serializer<T> {
  return createSerializer(
    (data: T) => {
      const runtimeCheckValue = data as any;
      if (typeof runtimeCheckValue === 'string' && runtimeCheckValue.length === 0) {
        return null;
      } else {
        return data;
      }
    },
    (data: any) => data as T
  );
}

export function optional<T>(serializer: Serializer<T>): Serializer<T|null> {
  return createSerializer(
    (data: T|null) => isDefined(data) ? serializer.serialize(data) : null,
    (data: any) => isDefined(data) ? serializer.deserialize(data) : null
  );
}

export function valueOrDefault<T>(serializer: Serializer<T>, defaultData: any): Serializer<T> {
  return createSerializer(
    (data: T) => serializer.serialize(data),
    (data: any) => serializer.deserialize(isDefined(data) ? data : defaultData)
  );
}

export function list<T>(serializer: Serializer<T>, defaultList?: T[]): Serializer<T[]> {
  return createSerializer(
    (data: T[]) => data.map(d => serializer.serialize(d)),
    (data: any) => {
      const arr = normalizeAsArray(data);
      if (arr.length === 0) {
        return defaultList ? defaultList : [];
      } else {
        return arr.map(d => serializer.deserialize(d));
      }
    }
  );
}

export const localizableSerializer: Serializer<Localizable> = createSerializer(
  (data: Localizable) => Object.assign({}, data),
  (data: any) => {
    const result: Localizable = {};

    if (data) {
      for (const lang of Object.keys(data)) {
        const value = data[lang];
        result[lang] = Array.isArray(value) ? value.join('\n\n') : value;
      }
    }

    return result;
  }
);

const isoDateFormat = 'YYYY-MM-DDTHH:mm:ssz';

export const dateSerializer: Serializer<Moment> = createSerializer(
  (data: Moment) => data.format(isoDateFormat),
  (data: any) => moment(data, isoDateFormat)
);

export const coordinateSerializer: Serializer<Coordinate> = createSerializer(
  (data: Coordinate) => data.x + ',' + data.y,
  (data: any) => {
    const split = data.split(',');
    if (split.length !== 2) {
      throw new Error('Misformatted coordinate: ' + data);
    }
    return { x: parseInt(split[0], 10), y: parseInt(split[1], 10) };
  }
);

export const stringSerializer = identitySerializer<string>(); // TODO: assert valid values
export const languageSerializer = identitySerializer<Language>(); // TODO: assert valid values

export const booleanSerializer: Serializer<boolean> = createSerializer(
  (data: boolean) => data ? true : null,
  (data: any) => data
);

const mailToUriPrefix = 'mailto:';

export const userLoginSerializer: Serializer<string> = createSerializer(
  (data: string) => mailToUriPrefix + data,
  (data: any) => data.substring(mailToUriPrefix.length)
);

export const typeSerializer: Serializer<Type[]> = createSerializer(
  (data: Type[]) => filterDefined(data.map(reverseMapType)),
  (data: any) => filterDefined(normalizeAsArray(data).map(mapType))
);
