import { assertNever, comparingPrimitive, containsAny, labelNameToResourceIdIdentifier, Localizable, remove, removeMatching, requireDefined, Status } from '@mju-psi/yti-common-ui';
import { Moment } from 'moment';
import { ConstraintType, EntityConstructor, KnownPredicateType, PredicateType, SelectionType } from '../types/entity';
import { Language, Localizer } from '../types/language';
import { glyphIconClassForType, glyphIconClassUnknown, mapType, normalizeClassType, resourceUrl, reverseMapType } from '../utils/entity';
import { hasLocalization } from '../utils/language';
import { DataType } from './dataTypes';
import { DefinedBy } from './definedBy';
import { GraphNode } from './graphNode';
import { init, initSingle, serialize } from './mapping';
import { Model } from './model';
import { Annotation, Association, Attribute, Predicate } from './predicate';
import { ReferenceData } from './referenceData';
import { normalizingDefinedBySerializer } from './serializer/common';
import { entity, entityAwareList, entityAwareOptional, entityAwareValueOrDefault, entityOrId, uriSerializer } from './serializer/entitySerializer';
import { booleanSerializer, createSerializer, dateSerializer, identitySerializer, list, localizableSerializer, optional, stringSerializer, typeSerializer, valueOrDefault } from './serializer/serializer';
import { Uri, Urn } from './uri';
import { VisualizationClass } from './visualization';
import { Concept } from './vocabulary';

export abstract class AbstractClass extends GraphNode {

  static abstractClassMappings = {
    id:         { name: '@id',         serializer: uriSerializer },
    label:      { name: 'name',       serializer: localizableSerializer },
    comment:    { name: 'description',     serializer: localizableSerializer },
    definedBy:  { name: 'isDefinedBy', serializer: normalizingDefinedBySerializer },
    status:     { name: 'versionInfo',     serializer: optional(identitySerializer<Status>()) },
    modifiedAt: { name: 'modified',        serializer: optional(dateSerializer) }
  };

  id: Uri;
  label: Localizable;
  comment: Localizable;
  definedBy: DefinedBy;
  status: Status|null;
  modifiedAt: Moment|null;

  selectionType: SelectionType = 'class';
  normalizedType = requireDefined(normalizeClassType(this.type));

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, AbstractClass.abstractClassMappings);
  }

  isClass() {
    return true;
  }

  isPredicate() {
    return false;
  }

  iowUrl() {
    return resourceUrl(requireDefined(requireDefined(this.definedBy).prefix), this.id);
  }

  isSpecializedClass() {
    return requireDefined(this.definedBy).isOfType('profile');
  }
}

export class ClassListItem extends AbstractClass {

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
  }
}

export class Class extends AbstractClass implements VisualizationClass {

  static classMappings = {
    localName:         { name: 'localName',       serializer: optional(stringSerializer) },
    subClassOf:        { name: 'subClassOf',      serializer: entityAwareOptional(uriSerializer) },
    scopeClass:        { name: 'targetClass',     serializer: entityAwareOptional(uriSerializer) },
    propertiesAll:     { name: 'property',        serializer: entityAwareList(entity(() => Property)) },
    subject:           { name: 'subject',         serializer: entityAwareOptional(entity(() => Concept)) },
    equivalentClasses: { name: 'equivalentClass', serializer: entityAwareList(uriSerializer) },
    constraint:        { name: 'constraint',      serializer: entityAwareValueOrDefault(entity(() => Constraint), {},
        (constraint: Constraint) => constraint.items.length > 0 || hasLocalization(constraint.comment)) },
    version:           { name: 'identifier',      serializer: optional(identitySerializer<Urn>()) },
    editorialNote:     { name: 'editorialNote',   serializer: localizableSerializer },
    createdAt:         { name: 'created',         serializer: optional(dateSerializer) },
    minProperties:           { name: 'minProperties',             serializer: optional(identitySerializer<number>()) },
    maxProperties:           { name: 'maxProperties',             serializer: optional(identitySerializer<number>()) },
    deactivated: { name: 'deactivated',           serializer: booleanSerializer },
    absolutePath:         { name: 'absolutePath',       serializer: optional(stringSerializer) }
  };

  subClassOf: Uri|null;
  scopeClass: Uri|null;
  localName: string|null;
  propertiesAll: Property[];
  properties: Property[];
  annotations: Property[];
  subject: Concept|null;
  equivalentClasses: Uri[];
  constraint: Constraint;
  version: Urn;
  editorialNote: Localizable;
  createdAt: Moment|null;
  minProperties: number|null;
  maxProperties: number|null;
  resolved = true;
  unsaved = false;
  external = false;
  deactivated: boolean;
  absolutePath: string|null;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);

    init(this, Class.classMappings);
    this.properties = [];
    this.annotations = [];
    for(let property of this.propertiesAll) {
      if (property.isAnnotation()) {
        this.annotations.push(property);
      } else {
        this.properties.push(property);
      }
    }
    this.properties.sort(comparingPrimitive<Property>(property => property.index));
    this.annotations.sort(comparingPrimitive<Property>(property => property.index));

    // normalize indices
    for (let i = 0; i < this.properties.length; i++) {
      this.properties[i].index = i;
    }
    for (let i = 0; i < this.annotations.length; i++) {
      this.annotations[i].index = i;
    }
  }

  get inUnstableState(): boolean {
    return this.status === 'INCOMPLETE' || this.status === 'DRAFT' || this.status === 'SUGGESTED';
  }

  addProperty(property: Property): void {
    if (property.isAnnotation()) {
      property.index = this.annotations.length;
      this.annotations.push(property);
    } else {
      property.index = this.properties.length;
      this.properties.push(property);
    }
    this.propertiesAll.push(property);
  }

  removeProperty(property: Property): void {
    if (property.isAnnotation()) {
      remove(this.annotations, property);
    } else {
      remove(this.properties, property);
    }
    remove(this.propertiesAll, property);
  }

  removeAnnotation(property: Property): void {
    remove(this.annotations, property);
    remove(this.propertiesAll, property);
  }

  get associationPropertiesWithTarget() {
    return this.properties.filter(property => property.isAssociation() && property.valueClass);
  }

  hasAssociationTarget(id: Uri) {
    for (const association of this.associationPropertiesWithTarget) {
      if (association.valueClass!.equals(id)) {
        return true;
      }
    }
    return false;
  }

  copy(toProfile: Model): Class {
    if (!toProfile.isOfType('profile')) {
      throw new Error('Class can be copied only to profile: ' + toProfile.id.toString());
    }
    const ctx = Object.assign({}, this.context, { [toProfile.prefix]: toProfile.namespace })
    const clone = this.clone();
    clone.id = new Uri(toProfile.namespace + this.id.name, ctx);
    clone.context = ctx
    clone.properties = clone.properties.map(p => p.copy());
    clone.unsaved = true;
    clone.definedBy = toProfile.asDefinedBy();
    return clone;
  }

  clone(): Class {
    const serialization = this.serialize(false, true);
    const result = new Class(serialization['@graph'], serialization['@context'], this.frame);
    result.unsaved = this.unsaved;
    result.external = this.external;
    return result;
  }

  serializationValues(_inline: boolean, clone: boolean): {} {
    return serialize(this, clone, Object.assign({}, GraphNode.graphNodeMappings, AbstractClass.abstractClassMappings, Class.classMappings));
  }
}

export class Constraint extends GraphNode {

  static constraintListItemsSerializer = entityAwareList(entity(() => ConstraintListItem));

  static constraintMappings = {
    and:     { name: 'andCond',     serializer: Constraint.constraintListItemsSerializer },
    or:      { name: 'orCond',      serializer: Constraint.constraintListItemsSerializer },
    not:     { name: 'notCond',     serializer: Constraint.constraintListItemsSerializer },
    comment: { name: 'description', serializer: localizableSerializer }
  };

  constraint: ConstraintType;
  items: ConstraintListItem[];

  comment = initSingle(this, Constraint.constraintMappings.comment);

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);

    const and = initSingle(this, Constraint.constraintMappings.and);
    const or = initSingle(this, Constraint.constraintMappings.or);
    const not = initSingle(this, Constraint.constraintMappings.not);

    if (and.length > 0) {
      this.constraint = 'and';
      this.items = and;
    } else if (or.length > 0) {
      this.constraint = 'or';
      this.items = or;
    } else if (not.length > 0) {
      this.constraint = 'not';
      this.items = not;
    } else {
      this.constraint = 'or';
      this.items = [];
    }
  }

  isVisible() {
    return this.items.length > 0 || hasLocalization(this.comment);
  }

  addItem(shape: Class) {
    const graph = {
      '@id': shape.id.uri,
      name: shape.label
    };

    this.items.push(new ConstraintListItem(graph, this.context, this.frame));
  }

  removeItem(removedItem: ConstraintListItem) {
    removeMatching(this.items, item => item === removedItem);
  }

  serializationValues(_inline: boolean, clone: boolean): {} {

    const result = serialize(this, clone, { comment: Constraint.constraintMappings.comment });

    switch (this.constraint) {
      case 'and':
        Object.assign(result, { '@type': 'sh:AbstractAndNodeConstraint' });
        Object.assign(result, serialize(this, clone, { items: Constraint.constraintMappings.and }));
        Object.assign(result, { [Constraint.constraintMappings.or.name]: null });
        Object.assign(result, { [Constraint.constraintMappings.not.name]: null });
        break;
      case 'or':
        Object.assign(result, { '@type': 'sh:AbstractOrNodeConstraint' });
        Object.assign(result, serialize(this, clone, { items: Constraint.constraintMappings.or }));
        Object.assign(result, { [Constraint.constraintMappings.and.name]: null });
        Object.assign(result, { [Constraint.constraintMappings.not.name]: null });
        break;
      case 'not':
        Object.assign(result, { '@type': 'sh:AbstractNotNodeConstraint' });
        Object.assign(result, serialize(this, clone, { items: Constraint.constraintMappings.not }));
        Object.assign(result, { [Constraint.constraintMappings.and.name]: null });
        Object.assign(result, { [Constraint.constraintMappings.or.name]: null });
        break;
      default:
        assertNever(this.constraint, 'Unsupported constraint: ' + this.constraint);
    }

    return result;
  }
}

export class ConstraintListItem extends GraphNode {

  static constraintListItemMapping = {
    shapeId: { name: '@id',   serializer: uriSerializer },
    label:   { name: 'name', serializer: localizableSerializer }
  };

  shapeId: Uri;
  label: Localizable;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, ConstraintListItem.constraintListItemMapping);
  }

  serializationValues(_inline: boolean, clone: boolean): {} {
    return serialize(this, clone, ConstraintListItem.constraintListItemMapping);
  }
}


const propertyTypeSerializer = createSerializer<KnownPredicateType>((data: KnownPredicateType) => reverseMapType(data), (data: any) => {
    const predicateType = requireDefined(mapType(data));

    if (predicateType !== 'association' && predicateType !== 'attribute' && predicateType !== 'annotation') {
      throw new Error('Unknown predicate type: ' + predicateType);
    }

    return predicateType;
  }
);

function resolvePredicateConstructor(framedData: any): EntityConstructor<Association|Attribute|Annotation> {

  const types = typeSerializer.deserialize(framedData['@type']);

  if (containsAny(types, ['association'])) {
    return Association;
  } else if (containsAny(types, ['attribute'])) {
    return Attribute;
  } else if (containsAny(types, ['annotation'])) {
    return Annotation;
  } else {
    throw new Error('Incompatible predicate type: ' + types.join());
  }
}

export class Property extends GraphNode {

  static propertyMapping = {
    internalId:         { name: '@id',                  serializer: uriSerializer },
    externalId:         { name: 'localName',            serializer: optional(stringSerializer) },
    status:             { name: 'versionInfo',          serializer: valueOrDefault(identitySerializer<Status>(), 'DRAFT') },
    label:              { name: 'name',                 serializer: localizableSerializer },
    comment:            { name: 'description',          serializer: localizableSerializer },
    example:            { name: 'example',              serializer: list(stringSerializer) },
    defaultValue:       { name: 'defaultValue',         serializer: optional(stringSerializer) },
    dataType:           { name: 'datatype',             serializer: optional(identitySerializer<DataType>()) },
    languageIn:         { name: 'languageIn',           serializer: list(identitySerializer<Language>()) },
    valueClass:         { name: 'node',                 serializer: entityAwareOptional(uriSerializer) },
    predicate:          { name: 'path',                 serializer: entityOrId(entity(resolvePredicateConstructor)) },
    index:              { name: 'order',                serializer: identitySerializer<number>() },
    minCount:           { name: 'minCount',             serializer: optional(identitySerializer<number>()) },
    maxCount:           { name: 'maxCount',             serializer: optional(identitySerializer<number>()) },
    minLength:          { name: 'minLength',            serializer: optional(identitySerializer<number>()) },
    maxLength:          { name: 'maxLength',            serializer: optional(identitySerializer<number>()) },
    in:                 { name: 'inValues',             serializer: list(stringSerializer) },
    hasValue:           { name: 'hasValue',             serializer: optional(stringSerializer) },
    pattern:            { name: 'pattern',              serializer: optional(stringSerializer) },
    referenceData:      { name: 'memberOf',             serializer: entityAwareList(entity(() => ReferenceData)) },
    classIn:            { name: 'classIn',              serializer: entityAwareList(uriSerializer) },
    stem:               { name: 'stem',                 serializer: entityAwareOptional(uriSerializer) },
    editorialNote:      { name: 'editorialNote',        serializer: localizableSerializer },
    resourceIdentifier: { name: 'isResourceIdentifier', serializer: booleanSerializer },
    uniqueLang:         { name: 'uniqueLang',           serializer: booleanSerializer },
    predicateType:      { name: 'type',                 serializer: optional(propertyTypeSerializer) },
    xmlWrapper:         { name: 'isXmlWrapper',         serializer: booleanSerializer },
    xmlAttribute:       { name: 'isXmlAttribute',       serializer: booleanSerializer },
    readOnlyValue:      { name: 'readOnlyValue',        serializer: booleanSerializer },
    deactivated:        { name: 'deactivated',          serializer: booleanSerializer },
    equals:             { name: 'equals',               serializer: entityAwareList(uriSerializer) },
    disjoint:           { name: 'disjoint',             serializer: entityAwareList(uriSerializer) },
    lessThan:           { name: 'lessThan',             serializer: entityAwareList(uriSerializer) },
    lessThanOrEquals:   { name: 'lessThanOrEquals',     serializer: entityAwareList(uriSerializer) },
    value:              { name: 'value',                serializer: localizableSerializer },
    annotationLabel:    { name: 'label',                serializer: localizableSerializer }
  };

  internalId: Uri;
  externalId: string|null;
  status: Status;
  label: Localizable;
  comment: Localizable;
  example: string[];
  defaultValue: string|null;
  dataType: DataType|null;
  languageIn: Language[];
  valueClass: Uri|null;
  predicate: Attribute|Association|Uri|Annotation;
  index: number;
  minCount: number|null;
  maxCount: number|null;
  minLength: number|null;
  maxLength: number|null;
  in: string[];
  hasValue: string|null;
  pattern: string|null;
  referenceData: ReferenceData[];
  classIn: Uri[];
  stem: Uri|null;
  editorialNote: Localizable;
  resourceIdentifier: boolean;
  uniqueLang: boolean;
  xmlWrapper: boolean;
  xmlAttribute: boolean;
  readOnlyValue: boolean;
  deactivated: boolean;
  equals: Uri[];
  disjoint: Uri[];
  lessThan: Uri[];
  lessThanOrEquals: Uri[];
  value: string|null;
  annotationLabel: Localizable;

  predicateType: KnownPredicateType|null = null;

  constructor(graph: any, context: any, frame: any) {
    super(graph, context, frame);
    init(this, Property.propertyMapping);
    if (Object.keys(this.annotationLabel).length) {
      this.label = this.annotationLabel;
    }
  }

  get predicateId() {
    const predicate = this.predicate;
    if (predicate instanceof Predicate) {
      return predicate.id;
    } else if (predicate instanceof Uri) {
      return predicate;
    } else {
      throw new Error('Unsupported predicate: ' + predicate);
    }
  }

  get inputType(): DataType {
    if (this.dataType) {
      return this.dataType;
    } else {
      return 'xsd:anyURI';
    }
  }

  hasOptionalMetadata() {
    return this.externalId
      || this.example
      || this.in.length > 0
      || this.defaultValue
      || this.hasValue
      || this.pattern
      || this.minLength
      || this.maxLength
      || this.minCount
      || this.maxCount
      || this.referenceData.length > 0;
  }

  hasTechnicalMetadata() {
    return this.resourceIdentifier
      || this.xmlWrapper
      || this.xmlAttribute
      || this.readOnlyValue
      || this.deactivated;
  }

  hasPropertyPairs() {
    return this.equals.length > 0
    || this.disjoint.length > 0
    || this.lessThan.length > 0
    || this.lessThanOrEquals.length > 0;
  }

  hasAssociationTarget() {
    return !!this.valueClass;
  }

  isAssociation() {
    return this.normalizedPredicateType === 'association';
  }

  isAttribute() {
    return this.normalizedPredicateType === 'attribute';
  }

  isAnnotation() {
    return this.normalizedPredicateType === 'annotation';
  }

  get inUnstableState(): boolean {
    return this.status === 'INCOMPLETE' || this.status === 'DRAFT' || this.status === 'SUGGESTED';
  }

  get normalizedPredicateType(): PredicateType|null {
    if (this.predicateType) {
      return this.predicateType;
    } else {
      const predicate = this.predicate;
      if (predicate instanceof Predicate) {
        return predicate.normalizedType;
      } else if (this.dataType) {
        return 'attribute';
      } else if (this.valueClass) {
        return 'association';
      } else {
        return null;
      }
    }
  }

  get glyphIconClass() {
    const type = this.normalizedPredicateType;

    if (type === 'association' && !this.hasAssociationTarget()) {
      return glyphIconClassUnknown;
    } else {
      return glyphIconClassForType(type ? [type] : []);
    }
  }

  copy(): Property {
    const clone = this.clone();
    clone.internalId = Uri.randomUUID();
    return clone;
  }

  clone(): Property {
    const serialization = this.serialize(false, true);
    return new Property(serialization['@graph'], serialization['@context'], this.frame);
  }

  serializationValues(_inline: boolean, clone: boolean): {} {
    return serialize(this, clone, Property.propertyMapping);
  }

  getIdIdentifierFromLabel(localizer: Localizer): string {
    return labelNameToResourceIdIdentifier(localizer.translate(this.label));
  }
}
