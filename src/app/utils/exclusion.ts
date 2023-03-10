import { arraysAreEqual, containsAny, firstMatching, isDefined } from '@mju-psi/yti-common-ui';
import { IPromise, IQService } from 'angular';
import { DataSource } from 'app/components/form/dataSource';
import { ClassListItem } from 'app/entities/class';
import { Model } from 'app/entities/model';
import { Uri } from 'app/entities/uri';
import { SearchClassType } from 'app/types/component';
import { WithDefinedBy, WithId, WithIdAndType } from 'app/types/entity';
import { collectIds } from './entity';


export type Exclusion<T> = (obj: T) => string|null;
export type LazyExclusion<T> = (obj: T) => IPromise<string|null>;

export function idExclusion<T extends { id: Uri }>(excludeId: Exclusion<Uri>,
                                                   excludeItem: Exclusion<T>,
                                                   dataSource: DataSource<T>,
                                                   $q: IQService): LazyExclusion<Uri|T> {
  return (id: Uri) => {

    if (!id) {
      return $q.when(null);
    }

    const excludeIdReason = excludeId && excludeId(id);

    if (excludeIdReason) {
      return $q.when(excludeIdReason);
    } else if (excludeItem) {
      return dataSource(id.toString()).then(items => {
        const item = firstMatching(items, i => i.id.equals(id));
        return item && excludeItem(item);
      });
    } else {
      return $q.when(null);
    }
  };
}

export function itemExclusion<T extends { id: Uri }>(excludeId: (id: Uri) => string,
                                                     excludeItem: (item: T) => string): Exclusion<T> {

  return (item: T) => {
    return item && (excludeId && excludeId(item.id)) || (excludeItem && excludeItem(item));
  };
}


export function combineExclusions<T>(...excludes: Exclusion<T>[]): Exclusion<T> {
  return (item: T) => {
    for (const exclude of excludes) {
      const result = exclude(item);
      if (result) {
        return result;
      }
    }
    return null;
  };
}

export function createSelfExclusion(self: WithIdAndType): Exclusion<WithIdAndType> {
  return (item: WithIdAndType) => {
    if (arraysAreEqual(self.type, item.type) && self.id.equals(item.id)) {
      return 'Self reference not allowed';
    } else {
      return null;
    }
  };
}

export function createDefinedByExclusion(model: Model): Exclusion<WithDefinedBy> {

  const modelIds = collectIds(model.importedNamespaces);
  modelIds.add(model.id.uri);

  return (item: WithDefinedBy) => {
    if (isDefined(item.definedBy) && !modelIds.has(item.definedBy.id.uri)) {
      return 'Not imported by model';
    } else {
      return null;
    }
  };
}

export function createExistsExclusion(itemIds: Set<string>): Exclusion<WithId> {
  return (item: WithId) => {
    if (itemIds.has(item.id.toString())) {
      return 'Already added';
    } else {
      return null;
    }
  };
}

export function createClassTypeExclusion(searchClassType: SearchClassType): Exclusion<ClassListItem> {

  const showShapes = containsAny([SearchClassType.Shape, SearchClassType.SpecializedClass], [searchClassType]);
  const showClasses = containsAny([SearchClassType.Class, SearchClassType.SpecializedClass], [searchClassType]);

  return (klass: ClassListItem) => {
    if (!showShapes && klass.isOfType('shape')) {
      return 'Shapes are not allowed';
    } else if (!showClasses && !klass.isOfType('shape')) {
      return 'Classes are not allowed';
    } else if (searchClassType === SearchClassType.SpecializedClass && !klass.isSpecializedClass()) {
      return 'Non specialized classes are not allowed';
    } else {
      return null;
    }
  };
}
