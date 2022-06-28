const {GraphQLList, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLNonNull } = require('graphql')
const UserType  = require('./GraphQLUserType.js')
const WalletTransactionType = require('./GraphQLWalletTransactionType.js')
const {
    getAllUsers,
    getUserTransactions,
    getAUser,
    withdrawFunds,
    transferFunds
  } = require("../services/user")

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    withdrawFunds: {
      type: WalletTransactionType,
      description: 'Withdraw funds',
      args: {
        withdrawalAmount: { type: GraphQLNonNull(GraphQLFloat) },
        user: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async(parent, args) => {
        let data = await withdrawFunds(args.user, +args.withdrawalAmount)
        return data
      }
    },
    transferFunds: {
      type: WalletTransactionType,
      description: 'Transfer funds',
      args: {
        user: { type: GraphQLNonNull(GraphQLString) },
        recipient:{ type: GraphQLNonNull(GraphQLString)},
        transferAmount:{type: GraphQLNonNull(GraphQLFloat)}
      },
      resolve: async(parent, args) => {
        let data = await transferFunds(args.user,args.recipient, +args.transferAmount)
        return data
      }
    },
    verifyEmail:{
      type: UserType,
      description: 'Verify Email',
      args: {
        email: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async(parent, args) => {
        let data = await verifyEmail(args.email)
        return data
      }
    }
  })
});


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    user:{
      type: UserType,
      description:'Query a user',
      args:{
        id:{type: GraphQLNonNull(GraphQLString)}
      },
      resolve: async( parent, args) => {
        let data = await getAUser(args.id)
        return data
      }
  },
    users: {
      type: new GraphQLList(UserType),
      description: 'query of  a list of users',
      resolve: async () => {
        let data = await getAllUsers();
        return data;
      }
    },
    transactions:{
        type: new GraphQLList(WalletTransactionType),
        description: 'query of  a list of transactions',
        args: {
            id: { type: GraphQLNonNull(GraphQLString) }
          },
        resolve: async (parent, args) => {
            let data = await getUserTransactions(args.id);
            return data;
        }
    }, 
  })
});

module.exports = {MutationType, RootQueryType}
