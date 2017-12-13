import * as _ from 'lodash';
import { requireDefined } from '../utils/object';
import { normalizeModelType, KnownModelType, State, Type } from './type';
import { Uri, Url, Urn } from './uri';
import { Localizable } from './contract';
import { modelUrl, resourceUrl } from '../utils/entity';
import { GroupListItem } from './group';
import { Language } from '../utils/language';
import { Moment } from 'moment';
import { contains, containsAny, remove } from '../utils/array';
import { DefinedBy } from './definedBy';
import { Vocabulary } from './vocabulary';
import { ReferenceData } from './referenceData';
import { init, serialize } from './mapping';
import { GraphNode } from './graphNode';
import {
  uriSerializer, entityAwareList, entity, entityAwareOptional, normalized
} from './serializer/entitySerializer';
import {
  localizableSerializer, stringSerializer, identitySerializer, optional, list,
  languageSerializer, dateSerializer, typeSerializer
} from './serializer/serializer';


function normalizeType(type: Type[]): KnownModelType {
  const normalizedType = requireDefined(normalizeModelType(type));

  if (normalizedType === 'model') {
    throw new Error('Model type must be known');
  } else {
    return normalizedType;
  }
}

export abstract class AbstractModel extends GraphNode {

  static abstractModelMappings = {
    id:        { name: '@id',                         serializer: uriSerializer },
    label:     { name: 'label',                       serializer: localizableSerializer },
    namespace: { name: 'preferredXMLNamespaceName',   serializer: stringSerializer },
    prefix:    { name: 'preferredXMLNamespacePrefix', serializer: stringSerializer }
  };

  id: Uri;
  label: Localizable;
  namespace: Url;
  prefix: string;
  normalizedType = normalizeType(this.type);

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, AbstractModel.abstractModelMappings);
  }

  iowUrl() {
    return modelUrl(this.prefix);
  }
}

export class ModelListItem extends AbstractModel {
  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
  }
}

export class Model extends AbstractModel {

  static groupSerializer = normalized(
    entity(() => GroupListItem),
    (data: any) => {
      if (!data['@type']) {
        // TODO: Shouldn't be needed but in all cases API doesn't return it
        return Object.assign({}, data, { '@type': 'foaf:Group' });
      } else {
        return data;
      }
    }
  );

  static modelMappings = {
    comment:        { name: 'comment',      serializer: localizableSerializer },
    state:          { name: 'versionInfo',  serializer: identitySerializer<State>() },
    vocabularies:   { name: 'references',   serializer: entityAwareList(entity(() => Vocabulary)) },
    namespaces:     { name: 'requires',     serializer: entityAwareList(entity(() => ImportedNamespace)) },
    links:          { name: 'relations',    serializer: entityAwareList(entity(() => Link)) },
    referenceDatas: { name: 'codeLists',    serializer: entityAwareList(entity(() => ReferenceData)) },
    group:          { name: 'isPartOf',     serializer: Model.groupSerializer },
    version:        { name: 'identifier',   serializer: optional(identitySerializer<Urn>()) },
    rootClass:      { name: 'rootResource', serializer: entityAwareOptional(uriSerializer) },
    language:       { name: 'language',     serializer: list<Language>(languageSerializer, ['fi', 'en']) },
    modifiedAt:     { name: 'modified',     serializer: optional(dateSerializer) },
    createdAt:      { name: 'created',      serializer: optional(dateSerializer) }
  };

  comment: Localizable;
  state: State;
  vocabularies: Vocabulary[];
  modelVocabularies: ModelVocabulary[];
  namespaces: ImportedNamespace[];
  links: Link[];
  referenceDatas: ReferenceData[];
  unsaved = false;
  group: GroupListItem;
  version: Urn|null;
  rootClass: Uri|null;
  language: Language[];
  modifiedAt: Moment|null;
  createdAt: Moment|null;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);

    init(this, Model.modelMappings);
    this.copyNamespacesFromRequires();
    this.updateModelVocabularies();
  }

  get groupId() {
    return this.group.id;
  }

  addVocabulary(vocabulary: Vocabulary) {
    this.vocabularies.push(vocabulary);
    this.updateModelVocabularies();
  }

  removeVocabulary(vocabulary: Vocabulary) {
    remove(this.vocabularies, vocabulary);
    this.updateModelVocabularies();
  }

  private updateModelVocabularies() {
    this.modelVocabularies = [
      ...this.group.vocabularies.map(v => new ModelVocabulary(v, true)),
      ...this.vocabularies.map(v => new ModelVocabulary(v, false))
    ];
  }

  addNamespace(ns: ImportedNamespace) {
    this.namespaces.push(ns);
    this.context[ns.prefix] = ns.namespace;
  }

  removeNamespace(ns: ImportedNamespace) {
    if (ns.namespaceType !== NamespaceType.TECHNICAL) {
      delete this.context[ns.prefix];
    }
    remove(this.namespaces, ns);
  }

  addLink(link: Link) {
    this.links.push(link);
  }

  removeLink(link: Link) {
    remove(this.links, link);
  }

  addReferenceData(referenceData: ReferenceData) {
    this.referenceDatas.push(referenceData);
  }

  removeReferenceData(referenceData: ReferenceData) {
    remove(this.referenceDatas, referenceData);
  }

  getNamespaces() {
    const namespaces: Namespace[] = [];
    const requiredNamespacePrefixes = new Set<string>();

    namespaces.push(new Namespace(this.prefix, this.namespace, NamespaceType.MODEL));
    requiredNamespacePrefixes.add(this.prefix);

    for (const require of this.namespaces) {
      namespaces.push(new Namespace(require.prefix, require.namespace, require.namespaceType));
      requiredNamespacePrefixes.add(require.prefix);
    }

    for (const prefix of Object.keys(this.context)) {
      if (!requiredNamespacePrefixes.has(prefix)) {
        const value = this.context[prefix];
        if (typeof value === 'string') {
          namespaces.push(new Namespace(prefix, value, NamespaceType.IMPLICIT_TECHNICAL));
        }
      }
    }

    return namespaces;
  }

  getNamespacesOfType(...namespaceTypes: NamespaceType[]) {
    const result: {[prefix: string]: string} = {};

    for (const namespace of this.getNamespaces()) {
      if (contains(namespaceTypes, namespace.type)) {
        result[namespace.prefix] = namespace.url;
      }
    }

    return result;
  }

  private copyNamespacesFromRequires() {
    for (const require of this.namespaces) {
      // if overriding existing namespace remove previous prefix
      for (const prefix of Object.keys(this.context)) {
        const value = this.context[prefix];
        if (value === require.namespace) {
          delete this.context[prefix];
        }
      }
      this.context[require.prefix] = require.namespace;
    }
  }

  expandContextWithKnownModels(context: any) {
    Object.assign(context, this.getNamespacesOfType(NamespaceType.MODEL, NamespaceType.EXTERNAL));
  }

  asDefinedBy() {
    return new DefinedBy({'@id': this.id.uri, '@type': typeSerializer.serialize(this.type), label: this.label}, this.context, this.frame);
  }

  namespaceAsDefinedBy(ns: Url) {
    for (const require of this.namespaces) {
      if (ns === require.namespace) {
        return new DefinedBy({'@id': ns, '@type': typeSerializer.serialize(require.type)}, this.context, this.frame);
      }
    }
    throw new Error('Namespace not found: ' + ns);
  }

  isNamespaceKnownToBeNotModel(namespace: Url) {
    return this.isNamespaceKnownAndOfType(namespace, [NamespaceType.EXTERNAL, NamespaceType.TECHNICAL, NamespaceType.IMPLICIT_TECHNICAL]);
  }

  isNamespaceKnownToBeModel(namespace: Url) {
    return this.isNamespaceKnownAndOfType(namespace, [NamespaceType.MODEL]);
  }

  isNamespaceKnownAndOfType(namespace: Url, types: NamespaceType[]): boolean  {
    for (const knownNamespace of this.getNamespaces()) {
      if (namespace === knownNamespace.url && containsAny(types, [knownNamespace.type])) {
        return true;
      }
    }
    return false;
  }

  isRequiredNamespace(ns: string) {
    for (const require of this.namespaces) {
      if (ns === require.namespace) {
        return true;
      }
    }
    return false;
  }

  linkToResource(id: Uri|null) {
    if (id && !id.isUrn()) {
      if (this.isNamespaceKnownToBeModel(id.namespace)) {
        return resourceUrl(requireDefined(id.resolve()).prefix, id);
      } else {
        return id.url;
      }
    } else {
      return null;
    }
  }

  clone(): Model {
    const serialization = this.serialize(false, true);
    const result = new Model(serialization['@graph'], serialization['@context'], this.frame);
    result.unsaved = this.unsaved;
    return result;
  }

  serializationValues(_inline: boolean, clone: boolean): {} {
    this.copyNamespacesFromRequires();
    return serialize(this, clone, Object.assign({}, AbstractModel.abstractModelMappings, Model.modelMappings));
  }
}

export class ModelVocabulary {

  constructor(public vocabulary: Vocabulary, public fixed: boolean) {
  }

  get id() {
    return this.vocabulary.id;
  }

  get internalId() {
    return this.vocabulary.internalId;
  }

  get material() {
    return this.vocabulary.material;
  }

  get title() {
    return this.vocabulary.title;
  }

  get description() {
    return this.vocabulary.description;
  }

  get href() {
    return this.vocabulary.href;
  }
}

export class ImportedNamespace extends GraphNode {

  static importedNamespaceMappings = {
    id:         { name: '@id',                         serializer: uriSerializer },
    label:      { name: 'label',                       serializer: localizableSerializer },
    _prefix:    { name: 'preferredXMLNamespacePrefix', serializer: stringSerializer },
    _namespace: { name: 'preferredXMLNamespaceName',   serializer: identitySerializer<Url>() }
  };

  id: Uri;
  label: Localizable;
  private _prefix: string;
  private _namespace: Url;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, ImportedNamespace.importedNamespaceMappings);
  }

  get namespaceType() {
    if (this.isOfType('resource')) {
      return NamespaceType.EXTERNAL;
    } else if (this.isOfType('standard')) {
      return NamespaceType.TECHNICAL;
    } else if (this.isOfType('model', 'library', 'profile')) {
      return NamespaceType.MODEL;
    } else {
      throw new Error('Unsupported type for imported namespace: [' + this.type.join(',') + '] for ' + this.id.toString());
    }
  }

  convertAsTechnical() {
    this.type = ['standard'];
  }

  get external() {
    return this.namespaceType === NamespaceType.EXTERNAL;
  }

  get technical() {
    return this.namespaceType === NamespaceType.TECHNICAL;
  }

  get prefixModifiable() {
    return this.external;
  }

  get namespaceModifiable() {
    return this.external;
  }

  get labelModifiable() {
    return this.external || this.technical;
  }

  get prefix() {
    return this._prefix;
  }

  set prefix(prefix) {
    this._prefix = prefix;
    this.id = new Uri(this.id.uri, { [prefix]: this.namespace });
  }

  get namespace() {
    return this._namespace;
  }

  set namespace(ns) {
    this._namespace = ns;
    this.id = new Uri(_.trimEnd(ns, '#/'), { [this.prefix]: ns });
  }

  serializationValues(inline: boolean, clone: boolean): {} {

    const onlyIdAndType = inline && !clone && this.namespaceType === NamespaceType.MODEL;

    const exclude = !onlyIdAndType ? [] : [
      ImportedNamespace.importedNamespaceMappings._namespace,
      ImportedNamespace.importedNamespaceMappings._prefix,
      ImportedNamespace.importedNamespaceMappings.label
    ];

    return serialize(this, clone, ImportedNamespace.importedNamespaceMappings, exclude);
  }
}

export class Link extends GraphNode {

  static linkMappings = {
    homepage:    { name: 'homepage',    serializer: uriSerializer },
    title:       { name: 'title',       serializer: localizableSerializer },
    description: { name: 'description', serializer: localizableSerializer }
  };

  homepage: Uri;
  title: Localizable;
  description: Localizable;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, Link.linkMappings);
  }

  serializationValues(_inline: boolean, clone: boolean): any {
    return serialize(this, clone, Link.linkMappings);
  }
}

export enum NamespaceType {
  IMPLICIT_TECHNICAL, TECHNICAL, MODEL, EXTERNAL
}

export class Namespace {
  constructor(public prefix: string, public url: string, public type: NamespaceType) {
  }
}
