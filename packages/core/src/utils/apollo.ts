import {
  DocumentNode,
  visit,
  parse,
  GraphQLSchema,
  extendSchema,
} from 'graphql';

import { removeFieldIfDirectives, removeDirectives } from './graphql';

export function transformDocumentWithApollo(
  doc: DocumentNode,
  { keepClientFields }: { keepClientFields: boolean },
): DocumentNode {
  return visit(doc, {
    Field(node) {
      return keepClientFields
        ? removeDirectives(node, ['client'])
        : removeFieldIfDirectives(node, ['client']);
    },
  });
}

export function transformSchemaWithApollo(
  schema: GraphQLSchema,
): GraphQLSchema {
  return extendSchema(
    schema,
    parse(/* GraphQL */ `
      directive @connection(key: String!, filter: [String]) on FIELD
    `),
  );
}
