import { contextlessInternalUrl } from '../utils/entity';
import { Uri } from './uri';
import { DefinedBy } from './definedBy';
import { init } from './mapping';
import { GraphNode } from './graphNode';
import { uriSerializer, entityAwareOptional, entity } from './serializer/entitySerializer';
import { localizableSerializer, optional, stringSerializer } from './serializer/serializer';
import { Localizable } from 'yti-common-ui/types/localization';

export class SearchResult extends GraphNode {

  static searchResultMapping = {
    id:        { name: '@id',                         serializer: uriSerializer },
    label:     { name: 'label',                       serializer: localizableSerializer },
    comment:   { name: 'comment',                     serializer: localizableSerializer },
    prefix:    { name: 'preferredXMLNamespacePrefix', serializer: optional(stringSerializer) },
    definedBy: { name: 'isDefinedBy',                 serializer: entityAwareOptional(entity(() => DefinedBy)) }
  };

  id: Uri;
  label: Localizable;
  comment: Localizable;
  prefix: string|null;
  definedBy: DefinedBy|null;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, SearchResult.searchResultMapping);
  }

  iowUrl() {
    return contextlessInternalUrl(this);
  }
}
