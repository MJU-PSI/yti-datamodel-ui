import { requireDefined } from '@mju-psi/yti-common-ui';
import { DefinedBy } from 'app/entities/definedBy';
import { entityAsId, normalized } from './entitySerializer';
import { WithIdAndType } from 'app/types/entity';
import { GraphNode } from 'app/entities/graphNode';
import { Uri } from 'app/entities/uri';

export const normalizingDefinedBySerializer = normalized<DefinedBy, GraphNode & WithIdAndType>(
  entityAsId(() => DefinedBy),
  (data, instance) => requireDefined(normalizeAsSingle(data, instance.id))
);

function normalizeAsSingle(graph: any, parentId: Uri): string|{} {

  if (Array.isArray(graph) && graph.length > 0) {

    const parentUri = parentId.uri;
    const ids = graph.map(item => typeof item === 'object' ? item['@id'] : item);

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      if (parentUri.startsWith(id)) {
        return graph[i];
      }
    }

    return graph[0];

  } else {
    return graph;
  }
}
