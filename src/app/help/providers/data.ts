import { classIdFromPrefixAndName, conceptIdFromPrefixAndIndex, modelIdFromPrefix, predicateIdFromPrefixAndName, vocabularyIdFromPrefix } from 'app/help/utils/id';
import { KnownModelType, KnownPredicateType } from 'app/types/entity';
import { VocabularyWithConceptsDetails } from 'app/services/entityLoader';
import { Localizable } from '@mju-psi/yti-common-ui';
import { Uri } from 'app/entities/uri';
import { OrganizationDetails } from 'app/help/services/entityCreatorService';

// TODO: more complete data with localizations to all UI languages

export const helpOrganization: OrganizationDetails = {
  id: Uri.fromUUID('74a41211-8c99-4835-a519-7a61612b1098'),
  label: {
    fi: 'Ohjeen organisaatio',
    en: 'Help organization',
    sv: 'sv test'
  }
};

export const helpVocabulary: VocabularyWithConceptsDetails = {
  vocabulary: {
    prefix: 'jhs',
    label: {
      fi: 'Julkisen hallinnon yhteinen sanasto',
      en: 'Finnish Public Sector Terminological Glossary (Controlled Vocabulary)',
      sl: 'Terminološki glosar javnega sektorja (nadzorovani besednjak)',
      sv: 'sv test'
    },
    description: {
      en: 'The Finnish Public Sector Terminological Glossary is a controlled vocabulary consisting of terms representing concepts that are defined in accordance with the Finnish Public Sector Recommendation JHS175. The concepts form a shared and harmonized core vocabulary for all public sector organizations.',
      sv: 'sv test'
    }
  },
  concepts: [
    {
      label: { fi: 'omistaja', en: 'owner', sl: 'lastnik', sv: 'sv test' },
      definition: { fi: 'omistajan määritelmä', en: 'owner definition', sl: 'definicija lastnika', sv: 'sv test' }
    }
  ]
};

export const helpImportedLibrary = {
  model: {
    type: 'library' as KnownModelType,
    prefix: 'jhs',
    label: {
      fi: 'Julkishallinnon tietokomponentit',
      en: 'Finnish Public Sector Core Components',
      sl: 'Osnovne komponente javnega sektorja',
      sv: 'sv test'
    },
    organizations: [helpOrganization.id.uri],
    vocabularies: [vocabularyIdFromPrefix(helpVocabulary.vocabulary.prefix)],
    classifications: ['P9'],
  },
  classes: {
    person: {
      label: { fi: 'Henkilö', en: 'Person', sl: 'Oseba', sv: 'sv test' }
    },
    contact: {
      label: { fi: 'Yhteystiedot', en: 'Contact', sl: 'Kontakt', sv: 'sv test' }
    },
    address: {
      label: { fi: 'Osoite', en: 'Address', sl: 'Naslov', sv: 'sv test' }
    },
    code: {
      label: { fi: 'Koodi', en: 'Code', sl: 'Koda', sv: 'sv test' }
    },
    vehicle: {
      label: { fi: 'Liikenneväline', en: 'Vehicle', sl: 'Vozilo', sv: 'sv test' },
      properties: [
        { predicate: predicateIdFromPrefixAndName('jhs', 'Rekisterinumero') },
        { predicate: predicateIdFromPrefixAndName('jhs', 'Lajikoodi') }
      ]
    },
    service: {
      label: { fi: 'Palvelu', en: 'Service', sl: 'Storitev', sv: 'sv test' },
      properties: [
        { predicate: predicateIdFromPrefixAndName('jhs', 'Nimi') },
        { predicate: predicateIdFromPrefixAndName('jhs', 'Kuvaus') }
      ]
    }
  },
  attributes: {
    registrationNumber: {
      label: { fi: 'Rekisterinumero', en: 'Registration number', sl: 'Registrska številka', sv: 'sv test' }
    },
    name: {
      label: { fi: 'Nimi', en: 'Name', sl: 'Ime', sv: 'sv test' }
    },
    description: {
      label: { fi: 'Kuvaus', en: 'Description', sl: 'Opis', sv: 'sv test' }
    },
  },
  associations: {
    categoryCode: {
      label: { fi: 'Lajikoodi', en: 'Category code', sl: 'Koda kategorije', sv: 'sv test' },
      valueClass: classIdFromPrefixAndName('jhs', 'Koodi')
    }
  }
};

export const helpLibrary = {
  model: {
    type: 'library' as KnownModelType,
    prefix: 'sea',
    label: { fi: 'Merenkulun tietokomponentit', en: 'Seafaring information components', sl: 'Komponente pomorskih informacij', sv: 'sv test' },
    comment: { fi: 'Merenkulun tietokomponentit', en: 'Seafaring information components', sl: 'Komponente pomorskih informacij', sv: 'sv test' },
    organizations: [helpOrganization.id.uri],
    vocabularies: [vocabularyIdFromPrefix(helpVocabulary.vocabulary.prefix)],
    classifications: ['P16'],
    namespaces: [modelIdFromPrefix(helpImportedLibrary.model.prefix)]
  },
  importedLibrary: helpImportedLibrary.model,
  vocabulary: helpVocabulary.vocabulary,
  classification: {
    label: { fi: 'Liikenne', en: 'Transport', sl: 'Transport', sv: 'sv test' } as Localizable,
    id: 'http://urn.fi/URN:NBN:fi:au:ptvl:v1142'
  },
  organization: helpOrganization,
  person: {
    prefix: helpImportedLibrary.model.prefix,
    details: helpImportedLibrary.classes.person
  },
  contact: {
    prefix: helpImportedLibrary.model.prefix,
    details: helpImportedLibrary.classes.contact,
  },
  address: {
    prefix: helpImportedLibrary.model.prefix,
    details: helpImportedLibrary.classes.address
  },
  newClass: {
    label: { fi: 'Vene', en: 'Boat', sl: 'Čoln'} as Localizable,
    comment: { fi: 'Vedessä kulkeva alus, joka on laivaa pienempi', en: 'Vehicle operating in water', sl: 'Vozilo, ki deluje v vodi', sv: 'sv test' } as Localizable,
    superClass: {
      prefix: helpImportedLibrary.model.prefix,
      details: helpImportedLibrary.classes.vehicle,
      properties: [
        predicateIdFromPrefixAndName(helpImportedLibrary.model.prefix, 'Rekisterinumero'),
        predicateIdFromPrefixAndName(helpImportedLibrary.model.prefix, 'Lajikoodi')
      ]
    },
    property: {
      name: {
        type: 'attribute' as KnownPredicateType,
        prefix: helpImportedLibrary.model.prefix,
        details: helpImportedLibrary.attributes.name
      },
      passengers: {
        type: 'attribute' as KnownPredicateType,
        label: { fi: 'Matkustajien lukumäärä', en: 'Number of passengers', sl: 'Število potnikov', sv: 'sv test' } as Localizable,
        comment: { fi: 'Matkustajien lukumäärä', en: 'Number of passengers', sl: 'Število potnikov', sv: 'sv test' } as Localizable
      },
      owner: {
        type: 'association' as KnownPredicateType,
        name: { fi: 'Omistaja', en: 'Owner', sl: 'Lastnik', sv: 'sv test' },
        conceptId: conceptIdFromPrefixAndIndex(helpVocabulary.vocabulary.prefix, 0),
        target: {
          prefix: helpImportedLibrary.model.prefix,
          details: helpImportedLibrary.classes.person
        }
      }
    }
  },
};

export const helpProfile = {
  model: {
    type: 'profile' as KnownModelType,
    prefix: 'plv',
    label: { fi: 'Palveluprofiili', en: 'Service profile', sl: 'Profil storitve', sv: 'sv test' },
    comment: { fi: 'Palveluprofiili', en: 'Service profile', sl: 'Profil storitve', sv: 'sv test' },
    organizations: [helpOrganization.id.uri],
    vocabularies: [vocabularyIdFromPrefix(helpVocabulary.vocabulary.prefix)],
    classifications: ['P9'],
    namespaces: [modelIdFromPrefix(helpImportedLibrary.model.prefix)]
  },
  importedLibrary: helpImportedLibrary.model,
  vocabulary: helpVocabulary.vocabulary,
  classification: {
    label: { fi: 'Yleiset tieto- ja hallintopalvelut', en: 'General information and administrative services', sl: 'Splošne informacije in administrativne storitve', sv: 'sv test' } as Localizable,
    id: 'http://urn.fi/URN:NBN:fi:au:ptvl:v1095',
  },
  organization: helpOrganization,
  newClass: {
    label: { fi: 'Tuote', en: 'Product', sl: 'Produkt', sv: 'sv test'} as Localizable,
    comment: { fi: 'Asia joka tuotetaan', en: 'Thing that is produced', sl: 'Stvar, ki je proizvedena', sv: 'sv test' } as Localizable,
    property: {
      name: {
        type: 'attribute' as KnownPredicateType,
        prefix: helpImportedLibrary.model.prefix,
        details: helpImportedLibrary.attributes.name
      },
      produced: {
        type: 'association' as KnownPredicateType,
        label: { fi: 'Tuotetaan palvelussa', en: 'Produced in a service', sl: 'Storitev', sv: 'sv test' } as Localizable,
        comment: { fi: 'Tapahtumaketju joka toteuttaa jotain', en: 'Event chain that produces something', sl: 'Produkt kot storitev', sv: 'sv test' } as Localizable,
        target: {
          prefix: 'plv',
          details: helpImportedLibrary.classes.service
        }
      }
    }
  },
  specializedClass: {
    prefix: helpImportedLibrary.model.prefix,
    details: helpImportedLibrary.classes.service,
    properties: [
      predicateIdFromPrefixAndName(helpImportedLibrary.model.prefix, 'Nimi'),
      predicateIdFromPrefixAndName(helpImportedLibrary.model.prefix, 'Kuvaus')
    ]
  }
};
