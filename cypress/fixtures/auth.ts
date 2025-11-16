// Shared fixtures for authentication flows

export const authFixtures = {
  credentials: {
    noAuth: {},
    tokenAuth: {
      token: 'test-token'
    },
    basicAuth: {
      username: 'admin',
      password: 'admin'
    }
  },
  collections: {
    empty: [],
    single: (id: string, name: string) => [{
      id,
      name
    }]
  },
  apiResponses: {
    success: {
      statusCode: 200,
      body: []
    },
    unauthorized: {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    },
    created: (id: string, name: string) => ({
      statusCode: 200,
      body: { id, name }
    }),
    deleted: {
      statusCode: 200,
      body: {}
    }
  }
}
