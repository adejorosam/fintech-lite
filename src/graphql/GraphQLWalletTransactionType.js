const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLFloat
  } = require('graphql');
  
const WalletTransactionType = new GraphQLObjectType({
    name: 'Wallet',
    description: 'Schema for wallet',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      trnxType: { type: GraphQLNonNull(GraphQLString) },
      purpose: { type: GraphQLNonNull(GraphQLString) },
      amount: {type: GraphQLNonNull(GraphQLFloat)},
      userId: {type: GraphQLNonNull(GraphQLInt)},
      sourceWalletId:{type: GraphQLNonNull(GraphQLInt)},
      destinationWalletId: {type: GraphQLNonNull(GraphQLInt)},
      amount:{ type: GraphQLNonNull(GraphQLInt)},

    })
  });
  module.exports = WalletTransactionType
