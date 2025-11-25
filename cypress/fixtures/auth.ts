// Shared fixtures for API testing

export const authFixtures = {
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
