import * as levenshtein from 'fast-levenshtein';
import { valueContains } from 'app/utils/searchFilter';
import { ContentExtractor, TextAnalysis } from 'app/types/filter';
import { isLocalizable } from 'app/utils/language';
import { isDefined } from 'yti-common-ui/utils/object';

export function analyze<T>(search: string, item: T, extractors: ContentExtractor<T>[]): TextAnalysis<T> {

  let score = Number.MAX_SAFE_INTEGER;
  let matchScore: number|null = null;

  if (!search) {
    return { item, score, matchScore, search: null };
  }

  for (const extractor of extractors) {

    const content = extractor(item);
    const values = isLocalizable(content) ? Object.values(content) : [content];

    for (const value of values) {

      const valueScore = calculateLevenshtein(search, value);
      score = Math.min(score, valueScore);

      if (valueContains(value, search)) {
        const previousMatchScore: number = isDefined(matchScore) ? matchScore : Number.MAX_SAFE_INTEGER;
        matchScore = Math.min(previousMatchScore, valueScore);
      }
    }
  }

  return { item, score, matchScore, search };
}

const useCollator = { useCollator: true };

function calculateLevenshtein(search: string, value: string) {

  const text = (value || '').trim();

  if (text.length > 0) {
    return levenshtein.get(search, value, useCollator);
  } else {
    return Number.MAX_SAFE_INTEGER;
  }
}
