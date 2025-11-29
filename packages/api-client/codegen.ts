import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'http://localhost:3001/shop-api': {
      headers: {
        'vendure-token': 'tooly',
      },
    },
  },
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
          Money: 'number',
        },
      },
    },
    'src/generated/shop-api.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;