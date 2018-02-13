import { Uri, Urn, Url } from './uri';

const inScheme = { '@id': 'http://www.w3.org/2004/02/skos/core#inScheme', '@type': '@id' };
const subject = { '@id': 'http://purl.org/dc/terms/subject', '@type': '@id' };
const comment = { '@id': 'http://www.w3.org/2000/01/rdf-schema#comment', '@container': '@language' };
const description = { '@id': 'http://purl.org/dc/terms/description', '@container': '@language' };
const predicate = { '@id': 'http://www.w3.org/ns/shacl#predicate', '@type': '@id' };
const property = { '@id': 'http://www.w3.org/ns/shacl#property', '@type': '@id' };

const coreContext = {
  comment,
  created: { '@id': 'http://purl.org/dc/terms/created', '@type': 'http://www.w3.org/2001/XMLSchema#dateTime' },
  definition: {'@id': 'http://www.w3.org/2004/02/skos/core#definition', '@container': '@language' },
  foaf: 'http://xmlns.com/foaf/0.1/',
  hasPart: { '@id': 'http://purl.org/dc/terms/hasPart', '@type': '@id' },
  homepage: { '@id': 'http://xmlns.com/foaf/0.1/homepage' },
  identifier: { '@id': 'http://purl.org/dc/terms/identifier' },
  imports: { '@id': 'http://www.w3.org/2002/07/owl#imports', '@type': '@id' },
  isDefinedBy: { '@id': 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy', '@type': '@id' },
  isPartOf: { '@id': 'http://purl.org/dc/terms/isPartOf', '@type': '@id' },
  label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label', '@container': '@language' },
  modified: { '@id': 'http://purl.org/dc/terms/modified', '@type': 'http://www.w3.org/2001/XMLSchema#dateTime' },
  nodeKind: { '@id': 'http://www.w3.org/ns/shacl#nodeKind', '@type': '@id' },
  prefLabel: { '@id': 'http://www.w3.org/2004/02/skos/core#prefLabel', '@container': '@language' },
  prov: 'http://www.w3.org/ns/prov#',
  title: { '@id': 'http://purl.org/dc/terms/title', '@container': '@language' },
  versionInfo: { '@id': 'http://www.w3.org/2002/07/owl#versionInfo' },
  editorialNote: { '@id': 'http://www.w3.org/2004/02/skos/core#editorialNote', '@container': '@language' }
};

const vocabularyContext = Object.assign({}, coreContext, {
  graph: { '@id' : 'http://termed.thl.fi/meta/graph' },
  id: { '@id' : 'http://termed.thl.fi/meta/id' },
  type: { '@id' : 'http://termed.thl.fi/meta/type' },
  uri: { '@id' : 'http://termed.thl.fi/meta/uri' },
  description
});

const conceptContext = Object.assign({}, coreContext, {
  inScheme
});

const classificationContext = Object.assign({}, coreContext, {
  order: { '@id': 'http://www.w3.org/ns/shacl#order' },
});

const organizationContext = Object.assign({}, coreContext, {
  description
});

const referenceDataServerContext = Object.assign({}, coreContext, {
  description
});

const referenceDataContext = Object.assign({}, coreContext, {
  creator: { '@id': 'http://purl.org/dc/terms/creator' },
  description
});

const referenceDataCodeContext = Object.assign({}, coreContext, {});

const predicateContext = Object.assign({}, coreContext, conceptContext, {
  range: { '@id': 'http://www.w3.org/2000/01/rdf-schema#range', '@type': '@id' },
  subPropertyOf: { '@id': 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf', '@type': '@id' },
  equivalentProperty: { '@id' : 'http://www.w3.org/2002/07/owl#equivalentProperty', '@type' : '@id' },
  datatype: { '@id': 'http://www.w3.org/ns/shacl#datatype', '@type': '@id' },
  subject
});

const propertyContext = Object.assign({}, coreContext, predicateContext, referenceDataContext, {
  index: { '@id': 'http://www.w3.org/ns/shacl#index' },
  example: { '@id': 'http://www.w3.org/2004/02/skos/core#example' },
  defaultValue: { '@id': 'http://www.w3.org/ns/shacl#defaultValue' },
  maxCount: { '@id': 'http://www.w3.org/ns/shacl#maxCount' },
  minCount: { '@id': 'http://www.w3.org/ns/shacl#minCount' },
  maxLength: { '@id': 'http://www.w3.org/ns/shacl#maxLength' },
  minLength: { '@id': 'http://www.w3.org/ns/shacl#minLength' },
  inValues: { '@id': 'http://www.w3.org/ns/shacl#in', '@container': '@list' },
  hasValue: { '@id': 'http://www.w3.org/ns/shacl#hasValue' },
  in: null,
  pattern: { '@id': 'http://www.w3.org/ns/shacl#pattern' },
  type: { '@id': 'http://purl.org/dc/terms/type', '@type': '@id' },
  valueShape: { '@id': 'http://www.w3.org/ns/shacl#valueShape', '@type': '@id' },
  predicate,
  classIn: { '@id': 'http://www.w3.org/ns/shacl#classIn', '@type': '@id' },
  memberOf: { '@id': 'http://purl.org/dc/dcam/memberOf'},
  stem: { '@id': 'http://www.w3.org/ns/shacl#stem', '@type': '@id' },
  language: { '@id': 'http://purl.org/dc/terms/language', '@container': '@list' },
  isResourceIdentifier: { '@id': 'http://iow.csc.fi/ns/iow#isResourceIdentifier' },
  uniqueLang: { '@id': 'http://www.w3.org/ns/shacl#uniqueLang' },
  isXmlWrapper: { '@id': 'http://iow.csc.fi/ns/iow#isXmlWrapper' },
  isXmlAttribute: { '@id': 'http://iow.csc.fi/ns/iow#isXmlAttribute' }
});

const classContext = Object.assign({}, coreContext, propertyContext, conceptContext, {
  abstract: { '@id': 'http://www.w3.org/ns/shacl#abstract'},
  property,
  scopeClass : { '@id' : 'http://www.w3.org/ns/shacl#scopeClass', '@type' : '@id' },
  subClassOf: { '@id': 'http://www.w3.org/2000/01/rdf-schema#subClassOf', '@type': '@id' },
  equivalentClass: { '@id' : 'http://www.w3.org/2002/07/owl#equivalentClass', '@type' : '@id' },
  constraint: { '@id': 'http://www.w3.org/ns/shacl#constraint', '@type': '@id' },
  or: { '@id': 'http://www.w3.org/ns/shacl#or', '@container': '@list' },
  and: { '@id': 'http://www.w3.org/ns/shacl#and', '@container': '@list' },
  not: { '@id': 'http://www.w3.org/ns/shacl#not', '@container': '@list' },
  subject
});

const versionContext = Object.assign({}, coreContext, {
  wasAttributedTo: { '@id': 'http://www.w3.org/ns/prov#wasAttributedTo', '@type': '@id' },
  wasRevisionOf : { '@id' : 'http://www.w3.org/ns/prov#wasRevisionOf',  '@type' : '@id' },
  generatedAtTime: { '@id': 'http://www.w3.org/ns/prov#generatedAtTime', '@type': 'http://www.w3.org/2001/XMLSchema#dateTime' },
  startedAtTime: { '@id': 'http://www.w3.org/ns/prov#startedAtTime', '@type': 'http://www.w3.org/2001/XMLSchema#dateTime' },
  generated: { '@id': 'http://www.w3.org/ns/prov#generated', '@type': '@id' },
  used: { '@id': 'http://www.w3.org/ns/prov#used', '@type': '@id' }
});

const namespaceContext = Object.assign({}, coreContext, {
  preferredXMLNamespaceName: { '@id': 'http://purl.org/ws-mmi-dc/terms/preferredXMLNamespaceName' },
  preferredXMLNamespacePrefix: { '@id': 'http://purl.org/ws-mmi-dc/terms/preferredXMLNamespacePrefix' }
});

const modelContext = Object.assign({}, coreContext, namespaceContext, referenceDataContext, vocabularyContext, {
  rootResource : { '@id' : 'http://rdfs.org/ns/void#rootResource',  '@type' : '@id' },
  references: { '@id': 'http://purl.org/dc/terms/references', '@type': '@id' },
  requires: { '@id': 'http://purl.org/dc/terms/requires', '@type': '@id' },
  relations: { '@id': 'http://purl.org/dc/terms/relation', '@container': '@list' },
  codeLists: { '@id': 'http://iow.csc.fi/ns/iow#codeLists', '@type': '@id' },
  language: { '@id': 'http://purl.org/dc/terms/language', '@container': '@list' }
});

const usageContext = Object.assign({}, coreContext, modelContext, {
  isReferencedBy: { '@id': 'http://purl.org/dc/terms/isReferencedBy', '@type': '@id' }
});

const modelPositionContext = Object.assign({}, coreContext, {
  predicate,
  property,
  pointXY: { '@id': 'http://iow.csc.fi/ns/iow#pointXY' },
  vertexXY: { '@id': 'http://iow.csc.fi/ns/iow#vertexXY', '@container': '@list' }
});

const searchResultContext = Object.assign({}, coreContext, modelContext, {});

function frame(data: any, context: {}, frame?: {}) {
  return Object.assign({ '@context': Object.assign({}, data['@context'], context) }, frame);
}

export function modelFrame(data: any, options: { id?: Uri|Urn, prefix?: string } = {}) {

  const frameObj: any = {
    isPartOf: {},
    codeLists: {
      '@omitDefault': true,
      '@default': [],
      isPartOf: {
        '@omitDefault': true,
        '@default': [],
        '@embed': '@always'
      }
    }
  };


  if (options.id) {
    Object.assign(frameObj, { 'dcterms:identifier': options.id.toString() });
  } else if (options.prefix) {
    Object.assign(frameObj, { preferredXMLNamespacePrefix: options.prefix });
  }

  return frame(data, modelContext, frameObj);
}

export function modelListFrame(data: any) {
  return frame(data, modelContext, { preferredXMLNamespaceName: {} });
}

export function usageFrame(data: any) {
  return frame(data, usageContext, {
    isReferencedBy: {
      '@id': {},
      isDefinedBy: {
        '@omitDefault': true,
        '@default': [],
        '@embed': '@always'
      }
    }
  });
}

export function propertyFrame(data: any) {
  return frame(data, propertyContext, {
    predicate: {}
  });
}

export function predicateListFrame(data: any) {
  return frame(data, predicateContext, { isDefinedBy: {} });
}

const embeddedSubject: any = {
  '@id': {},
  '@omitDefault': true,
  '@default': [],
  '@embed': '@always',
  inScheme: {
    '@id': {},
    '@omitDefault': true,
    '@default': [],
    '@embed': '@always'
  }
};

export function predicateFrame(data: any) {
  return frame(data, predicateContext, {
    '@type': ['owl:DatatypeProperty', 'owl:ObjectProperty', 'rdf:Property'],
    isDefinedBy: {'@embed': '@always'},
    subject: embeddedSubject,
    equivalentProperty: {
      '@omitDefault': true,
      '@default': [],
      '@embed': false
    },
    subPropertyOf: {
      '@embed': false
    }
  });
}

export function classFrame(data: any) {
  return frame(data, classContext, {
    '@type': ['rdfs:Class', 'sh:Shape'],
    isDefinedBy: { '@embed': '@always' },
    subject: embeddedSubject,
    scopeClass: {
      '@embed': false
    },
    subClassOf: {
      '@embed': false
    },
    property: {
      valueShape: {
        '@omitDefault': true,
        '@default': [],
        '@embed': false
      },
      predicate: {
        '@embed': false
      },
      memberOf: {
        '@omitDefault': true,
        '@default': [],
        isPartOf: {
          '@embed': '@always'
        }
      }
    }
  });
}

export function classListFrame(data: any) {
  return frame(data, classContext, { isDefinedBy: {} });
}

export function conceptFrame(data: any, id: Uri|Url) {

  return frame(data, conceptContext, {
    '@id': id.toString(),
    '@type': 'skos:Concept'
  });
}

export function conceptListFrame(data: any) {

  return frame(data, conceptContext, {
    '@type': 'skos:Concept',
  });
}

export function classificationListFrame(data: any) {

  return frame(data, classificationContext, {
    '@type': 'foaf:Group',
    identifier: {},
    hasPart: {
      '@omitDefault': true,
      '@default': [],
      '@embed': false
    }
  });
}

export function organizationFrame(data: any) {
  return frame(data, organizationContext, {
    '@type': 'foaf:Organization'
  });
}

export function vocabularyFrame(data: any) {
  return frame(data, vocabularyContext, {
    '@type': ['skos:ConceptScheme']
  });
}

export function namespaceFrame(data: any) {
  return frame(data, namespaceContext);
}

export function referenceDataServerFrame(data: any) {
  return frame(data, referenceDataServerContext, {
    identifier: {}
  });
}

export function referenceDataFrame(data: any) {
  return frame(data, referenceDataContext, {
    '@type': ['iow:FCodeScheme', 'dcam:VocabularyEncodingScheme'],
    isPartOf: {
      '@omitDefault': true,
      '@default': [],
      '@embed': '@always'
    }
  });
}

export function referenceDataCodeFrame(data: any) {
  return frame(data, referenceDataCodeContext, { '@type': 'iow:FCode' });
}

export function searchResultFrame(data: any) {
  return frame(data, searchResultContext, {
    '@id': {},
    '@type': {},
    isDefinedBy: {
      '@omitDefault': true,
      '@default': [],
      '@embed': '@always'
    }
  });
}

export function classVisualizationFrame(data: any) {
  return frame(data, classContext, {
    '@type': ['rdfs:Class', 'sh:Shape'],
    property: {
      predicate: {
        '@embed': false
      },
      valueShape: {
        '@omitDefault': true,
        '@default': [],
        '@embed': false
      },
      classIn: {
        '@omitDefault': true,
        '@default': [],
        '@embed': false
      },
      memberOf: {
        '@omitDefault': true,
        '@default': [],
        isPartOf: {
          '@embed': '@always'
        }
      }
    },
    subject: {
      '@embed': false
    },
    subClassOf: {
      '@embed': false
    },
    scopeClass: {
      'embed': false
    },
    isDefinedBy: {
      '@embed': false
    }
  });
}

export function modelPositionsFrame(data: any) {
  return frame(data, modelPositionContext, {
    '@type': ['rdfs:Class', 'sh:Shape'],
    property: {
      vertexXY: {},
      '@omitDefault': true,
      '@default': [],
      '@embed': '@always'
    }
  });
}

export function versionFrame(data: any) {
  return frame(data, versionContext, {
    generated: {
      wasAttributedTo: {},
      wasRevisionOf: {
        '@omitDefault': true,
        '@default': [],
        '@embed': false
      }
    },
    'used': {
      '@embed': '@never'
    }
  });
}
