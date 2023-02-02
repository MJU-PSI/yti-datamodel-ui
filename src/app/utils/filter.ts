import { SearchFilter, TextAnalysis } from 'app/types/filter';
import { limit, allMatching } from '@mju-psi/yti-common-ui';

const defaultSearchLimit = 100;

export function applyFilters<T>(searchResults: TextAnalysis<T>[], filters: SearchFilter<T>[], limitResults = defaultSearchLimit) {
  return limit(searchResults.filter(results => allMatching(filters, filter => filter(results))), limitResults);
}
