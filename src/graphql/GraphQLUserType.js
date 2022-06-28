const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    // GraphQLFloat
  } = require('graphql');

  const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Schema for users',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      wallet:{ type: GraphQLNonNull(GraphQLInt)}
    })
  });

  module.exports = UserType
  