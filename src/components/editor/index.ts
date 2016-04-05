import { SearchConceptModal } from './searchConceptModal';
import { SearchClassModal } from './searchClassModal';
import { SearchPredicateModal } from './searchPredicateModal';
import { AddPropertiesFromClassModal } from './addPropertiesFromClassModal';
import { module as mod }  from './module';
export default mod.name;

import './classForm';
import './classView';
import './classVisualization';
import './uriSelect';
import './editableConstraint';
import './editableMultipleUriSelect';
import './editableMultipleDataTypeInput';
import './editableSubjectSelect';
import './predicateForm';
import './predicateView';
import './propertyView';
import './rangeSelect';
import './selectionView';
import './subjectView';
import './usage';
import './usagePanel';
import './visualizationView';

mod.service('addPropertiesFromClassModal', AddPropertiesFromClassModal);
mod.service('searchClassModal', SearchClassModal);
mod.service('searchConceptModal', SearchConceptModal);
mod.service('searchPredicateModal', SearchPredicateModal);
