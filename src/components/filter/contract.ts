import { AddNew } from '../common/searchResults';
import { all, limit } from '../../utils/array';
import { Localizable } from '../../entities/contract';

const defaultSearchLimit = 100;

export function applyFilters<T>(searchResults: TextAnalysis<T>[], filters: SearchFilter<T>[], limitResults = defaultSearchLimit) {
  return limit(searchResults.filter(results => all(filters, filter => filter(results))), limitResults);
}

export interface SearchController<T> {
  items: T[];
  searchResults: (AddNew|T)[];
  search(): void;
  addFilter(filter: SearchFilter<T>): void;
}

export type SearchFilter<T> = (analyzedItem: TextAnalysis<T>) => boolean;

export interface ContentMatcher<T> {
  name: string;
  extractor: ContentExtractor<T>;
}

export type ContentExtractor<T> = (item: T) => Localizable|string;

export interface TextAnalysis<T> {
  item: T;
  score: number;
  matchScore: number|null;
  search: string|null;
}
