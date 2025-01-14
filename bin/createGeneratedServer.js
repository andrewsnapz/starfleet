const fs = require("fs");
const chalk = require('chalk');

function createGeneratedServer(mongoDBUrl = 'mongodb://localhost:27017/starfleet', mongoDBname = 'starfleet') { 
    const serverText = `
    const mongoose = require('mongoose'); 
    const fs = require('fs');
    const { ApolloServer } = require('apollo-server');
    const typeDefs = fs.readFileSync('./graphqlsrc/models/starfleet-SDL.graphql', 'utf8');
    const resolvers = require('./graphqlsrc/resolvers/starfleet-resolvers')

    const DB = '${mongoDBUrl}';

    mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology:	true, dbName: '${mongoDBname}' })

    .then(() => console.log('MongoDB successfully connected')) 

    .catch( err => console.log('Error connecting to db: ', err));


    const server = new ApolloServer({ typeDefs, resolvers }); 


    server.listen().then(({ url }) => { console.log ('🚀  Server ready at' + url ); });
    `
    fs.writeFile(`${process.cwd()}/graphqlServer.js`, serverText, err => {
        if (err) console.log(err);
        return console.log(chalk.green('✔'),chalk.cyan.bold('Your graphql server file has been created!'))
    })
}

module.exports = createGeneratedServer;