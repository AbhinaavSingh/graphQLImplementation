var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const graphqlTools = require('graphql-tools');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var async = require('async');
const app = express();
var port = 2000;
oracledb.fetchAsString = [oracledb.CLOB];


process
.on('SIGTERM', function() {
  console.log("\nTerminating");
  process.exit(0);
})
.on('SIGINT', function() {
  console.log("\nTerminating");
  process.exit(0);
});

// Simple Blog schema with ID, Title and Content fields
const typeDefs = `
  type WELL {
    id: ID
	uwi: String
	well_by_name: String
	country: String
	field: String
	field_by_id: Float
	project_default_id: Float
	boreholes : [BOREHOLE]
  }
  
  type FIELD {
	Id: ID
	Name: String
	wells : [WELL]
	
}

type BOREHOLE {
	Id: ID
	Name: String
	Ubhi: String
	well_id: Float
	
}


  type Query {
    wells_by_id (id: ID): WELL,
    well_by_fieldId (id: ID): [WELL],
	borehole_by_wellId (id: ID): [BOREHOLE],
	WELL(id: ID) : [WELL],
	field_by_id (Id: ID ): FIELD,
	field_by_name (Name: String): FIELD,
	borehole_by_id (Id: ID ): BOREHOLE,
	well_by_name (Name: String): WELL
  }
  
    input WellEntry {
    uwi: String
	well_by_name: String
	field: String
  }
   input FieldEntry {
	Name: String
  }
   input BoreholeEntry {
	Name: String
	Ubhi: String
	well_id: Float
 }
  type Mutation {
  createWell(input: WellEntry): WELL,
  createField(input: FieldEntry): FIELD,
  createBorehole(input: BoreholeEntry): BOREHOLE,
  updateWell(id: Int, input: WellEntry): WELL,
  deleteWell(id: Int): WELL
  deleteBorehole (Id: ID): BOREHOLE,
  deleteField (Id: ID): FIELD,
  updateBorehole(Id: ID,input: BoreholeEntry): BOREHOLE
}
`;	



async function getAllWells() {
	var listOfVars = ["id","uwi"];

  var arrayLength = listOfVars.length;
  let sql = 'SELECT ' + listOfVars.toString() + ' FROM WELL';
  console.log(sql);
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql);
  await conn.close();
  let j = [];
  
  for (var row = 0; row < result.rows.length; row++)  {
	let keyVal = {};
  for (var col = 0; col < arrayLength; col++)  {
	  keyVal[listOfVars[col]] = result.rows[row][col];
	  }
	  j.push(keyVal);
  }
  console.log(j);
  return (j);
};

async function getWellsById(id) {
	var listOfVars = ["id","uwi"];

  var arrayLength = listOfVars.length;
  let sql = 'SELECT ' + listOfVars.toString() + ' FROM WELL WHERE id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	 console.log("ASD"+listOfVars.toString());
  console.log(keyVal);
  
  var keyValBoreholes = getBoreholeByWellId(id);


	console.log("ABHINAAVSINGHISTHEBEST");
	console.log(keyValBoreholes);

	 keyVal["boreholes"] = keyValBoreholes; 
  return (keyVal);
};


async function getWellsByIdByFieldId(id) {
	var listOfVars = ["id","uwi",];

  var arrayLength = listOfVars.length;
  let sql = 'SELECT ' + listOfVars.toString() + ' FROM WELL WHERE field_by_id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  
  for (var row = 0; row < result.rows.length; row++)  {
	let keyVal = {};
  for (var col = 0; col < arrayLength; col++)  {
	  keyVal[listOfVars[col]] = result.rows[row][col];
	  }
	  j.push(keyVal);
  }
  console.log(j);
  return (j);
  
  
};



async function getBoreholeByWellId(id) {
var listOfVars = ["Id" ,"Name"];
	var arrayLength = listOfVars.length;
  let sql = 'SELECT ' + listOfVars.toString() + ' FROM Borehole WHERE well_id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  
  for (var row = 0; row < result.rows.length; row++)  {
	let keyVal = {};
  for (var col = 0; col < arrayLength; col++)  {
	  keyVal[listOfVars[col]] = result.rows[row][col];
	  }
	  j.push(keyVal);
  }
  console.log(j);
  return (j);
  
  
};



async function getFieldId(id) {
	var listOfVars = ["Insert_User" ,"Id" ,"Name" ];
	var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM Field WHERE Id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	 console.log("ASD"+listOfVars.toString());
  console.log(keyVal);   


var keyValWells2 = getWellsByIdByFieldId(id);


	console.log(keyValWells2);

	 keyVal["wells"] = keyValWells2; 
  return (keyVal);
};


async function getBoreholeId(id) {
	var listOfVars = ["Id" ,"Name"];
	var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM Borehole WHERE Id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }

  return (keyVal);
};


async function getField(Name) {
	var listOfVars = ["Id"  ,"Name" ];
	var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM Field WHERE Name = :Name';
  let binds = [Name];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	 console.log("ASD"+listOfVars.toString());
  console.log(keyVal);
  return (keyVal);
};

async function getBorehole_name(Name) {
var listOfVars = ["Id" ,"Name" ];
	var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM Borehole WHERE Name = :Name';
  let binds = [Name];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	 console.log("ASD"+listOfVars.toString());
  console.log(keyVal);
  return (keyVal);
};


async function get_well_by_name(Name) {
	var listOfVars = ["id","uwi"];

  var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM WELL WHERE well_by_name = :Name';
  let binds = [Name];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  await conn.close();
  let j = [];
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	 console.log("ASD"+listOfVars.toString());
  console.log(keyVal);
  return (keyVal);
};

async function createWELL(input) {
  let conn = await oracledb.getConnection();
  let sql = 'INSERT INTO WELL(uwi, well_by_name, field, remarks) VALUES(:0,:1,:2,:3)';
  binds = [input.uwi,input.well_by_name,input.field,input.remarks];
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return get_well_by_name(input.well_by_name);
}

async function createField(input) {
  let conn = await oracledb.getConnection();
  let sql = 'INSERT INTO Field(Name, Original_Source, Remarks, Source) VALUES(:0,:1,:2,:3)';
  binds = [input.Name,input.Original_Source,input.Remarks,input.Source];
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return getField(input.Name);
}

async function createBorehole(input) {
  let conn = await oracledb.getConnection();
  let sql = 'INSERT INTO Borehole(Name, Ubhi, well_id, Remarks) VALUES(:0,:1,:2,:3)';
  binds = [input.Name,input.Ubhi,input.well_id,input.Remarks];
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return getBorehole_name(input.Name);
}

async function deleteWELL(id) {
var listOfVars = ["Id" ,"Name" ];
  var arrayLength = listOfVars.length;
  let sql = 'SELECT ' + listOfVars.toString() + ' FROM WELL WHERE id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	  
	  var returnObject = keyVal;
  sql = 'DELETE FROM WELL WHERE id = :id';
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return returnObject;
}

async function deleteField(id) {
var listOfVars = ["Id" ,"Name" ];	var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM Field WHERE Id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	  
	  var returnObject = keyVal;
  sql = 'DELETE FROM Field WHERE Id = :id';
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return returnObject;
}


async function deleteBorehole(id) {
var listOfVars = ["Id" ,"Name" ];	var arrayLength = listOfVars.length;

  let sql = 'SELECT '+listOfVars.toString()+' FROM Borehole WHERE Id = :id';
  let binds = [id];
  let conn = await oracledb.getConnection();
  let result = await conn.execute(sql, binds);
  let keyVal = {};
  for (var i = 0; i < arrayLength; i++)  {
	  keyVal[listOfVars[i]] = result.rows[0][i];
	  }
	  
	  var returnObject = keyVal;
  sql = 'DELETE FROM Borehole WHERE Id = :id';
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return returnObject;
}

async function updateBorehole(id,input) {
  let conn = await oracledb.getConnection();
  let sql = 'INSERT INTO Borehole(Name, Ubhi, well_id, Remarks) VALUES(:0,:1,:2,:3)';
  sql = "update Borehole set ubhi = :0 , well_id = :1, name = :2, remarks = :3 where id = :4"
  binds = [input.Ubhi,input.well_id,input.Name,input.Remarks,id];
  result = await conn.execute(sql, binds, {autoCommit: true});
  await conn.close();
  return getBorehole_name(input.Name);
}

// Resolver to match the GraphQL query and return data
const resolvers = {
  Query: {
	  WELL(root,{id}, context, info) {
		//getWellsById();
		console.log(id+"ASDASD");
      return getAllWells();
    },
    wells_by_id(root,{id}, context, info) {
		//getWellsById();
		console.log(id+"ASDASD");
      return getWellsById(id);
    },
	well_by_fieldId(root,{id}, context, info) {
		//getWellsById();
		console.log(id+"ASDASD");
      return getWellsByIdByFieldId(id);
    },
	field_by_id(root,{Id}, context, info) {
		//getWellsById();
		console.log(Id+"ASDASD");
      return getFieldId(Id);
    },
	borehole_by_id(root,{Id}, context, info) {
		//getWellsById();
		console.log(Id+"ASDASD");
      return getBoreholeId(Id);
    },
	field_by_name(root,{Name}, context, info) {
		//getWellsById();
		//console.log(id+"ASDASD");
      return getField(Name);
    },
	well_by_name(root,{Name}, context, info) {
		//getWellsById();
		//console.log(id+"ASDASD");
      return get_well_by_name(Name);
    },
	borehole_by_wellId(root,{id}, context, info) {
		//getWellsById();
		console.log(id+"ASDASD");
      return getBoreholeByWellId(id);
    }
  },
  Mutation: {
    createWell(root, {input}, context, info) {
      return createWELL(input);
    },

    updateWell(root, {id, input}, context, info) {
      return updateWELL(id, input);
    },

    deleteWell(root, {id}, context, info) {
      return deleteWELL(id);
    },
	createField(root, {input}, context, info) {
      return createField(input);
    },
	createBorehole(root, {input}, context, info) {
      return createBorehole(input);
    },
	deleteBorehole(root, {Id}, context, info) {
      return deleteBorehole(Id);
    },
	deleteField(root, {Id}, context, info) {
      return deleteField(Id);
    },
	updateBorehole(root, {Id, input}, context, info) {
      return updateBorehole(Id, input);
    }
  }
};


// Build the schema with Type Definitions and Resolvers
const schema = graphqlTools.makeExecutableSchema({typeDefs, resolvers});



// Create a DB connection pool
async function startOracle() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Connection Pool created");
  } catch (err) {
    console.error(err);
  }
}

// Start the webserver
async function ws() {
  app.use('/graphql', graphqlHTTP({
    graphiql: true,
	schema
  }));

  app.listen(2000, function() {
    console.log('Listening on http://localhost:' + port + '/graphql');
  })
}


// Do it
async function run() {
  await startOracle();
  await ws();
}

run();


