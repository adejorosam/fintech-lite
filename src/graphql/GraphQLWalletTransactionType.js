const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLFloat
  } = require('graphql');
const { getAUser } = require('../services/user');
const UserType = require('./GraphQLUserType');
  
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
      user: {
        type: UserType,
        resolve: (parent, args) => {
          return getAUser(args.userId)
        }
      },
      sourceWallet:{
        type:WalletTransactionType,
        resolve: (parent, args) => {
          // return
        }
      },
      destinationWallet:{
        type:WalletTransactionType,
        resolve: (parent, args) => {
          // return
        }
      }
    })
  });
  module.exports = WalletTransactionType
