const {GraphQLList, GraphQLObjectType, GraphQLInt } = require('graphql')
const UserType  = require('./GraphQLUserType.js')
const WalletTransactionType = require('./GraphQLWalletTransactionType.js')
const {
    withdrawFunds,
    transferFunds,
    getAllUsers,
    getLoggedinUser,
    getUserTransactions,
    verifyEmail,
  } = require("../services/user")

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
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
            id: { type: GraphQLInt }
          },
        resolve: async (parent, args) => {
            let data = await getUserTransactions(args.id);
            return data;
        }
    },
    user:{
        type: UserType,
        description:'Query a user',
    }
  })
});
module.exports = RootQueryType
