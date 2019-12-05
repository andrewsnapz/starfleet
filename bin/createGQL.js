const fs = require('fs');
const chalk = require("chalk");

const { printSchema } = require('graphql');
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer } = require('graphql-compose');

const customizationOptions = {};
const createGQL = (model, modelName) => {
  const ModelTC = composeWithMongoose(model, customizationOptions);

  schemaComposer.Query.addFields({
	[modelName+"ById"] : ModelTC.getResolver('findById'),
	[modelName+"ByIds"] : ModelTC.getResolver('findByIds'),
	[modelName+"One"] : ModelTC.getResolver('findOne'),
	[modelName+"Many"] : ModelTC.getResolver('findMany'),
	[modelName+"Count"] : ModelTC.getResolver('count'),
	[modelName+"Connection"] : ModelTC.getResolver('connection'),
	[modelName+"Pagination"] : ModelTC.getResolver('pagination'),
  });

  schemaComposer.Mutation.addFields({
	[modelName+"CreateOne"] : ModelTC.getResolver('createOne'),
	[modelName+"CreateMany"] : ModelTC.getResolver('createMany'),
	[modelName+"UpdateById"] : ModelTC.getResolver('updateById'),
	[modelName+"UpdateOne"] : ModelTC.getResolver('updateOne'),
	[modelName+"UpdateMany"] : ModelTC.getResolver('updateMany'),
	[modelName+"RemoveById"] : ModelTC.getResolver('removeById'),
	[modelName+"RemoveOne"] : ModelTC.getResolver('removeOne'),
	[modelName+"RemoveMany"] : ModelTC.getResolver('removeMany'),
  });

  const graphqlSchemaObj = schemaComposer.buildSchema();
  const graphqlSDL = printSchema(graphqlSchemaObj, { commentDescriptions: true });
  const filename = modelName + '.graphql';
  fs.writeFile(`./graphqlsrc/models/${filename}`, graphqlSDL, err => {
		if (err) {
			return console.log(err);
		}
	console.log(chalk.white.bgGreen.bold(`Done! Your graphqlSchema has been created and put into your working directory!`, String.fromCharCode(10003)))
	console.log(String.fromCharCode(10003));
  });
};

module.exports = { createGQL }
