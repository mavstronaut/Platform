/**
 * Autogenerated base class representing app_user rows
 * in the Users database.
 *
 * Don't change this file, since it can be overwritten.
 * Instead, change the Users/AppUser.js file.
 *
 * @module Users
 */

var Q = require('Q');
var Db = Q.require('Db');
var Users = Q.require('Users');
var Row = Q.require('Db/Row');

/**
 * Base class representing 'AppUser' rows in the 'Users' database
 * @namespace Base.Users
 * @class AppUser
 * @extends Db.Row
 * @constructor
 * @param {object} [fields={}] The fields values to initialize table row as 
 * an associative array of `{column: value}` pairs
 */
function Base (fields) {
	Base.constructors.apply(this, arguments);
}

Q.mixin(Base, Row);

/**
 * @property {String|Buffer}
 * @type userId
 */
/**
 * @property {String}
 * @type provider
 */
/**
 * @property {String}
 * @type appId
 */
/**
 * @property {String|Db.Expression}
 * @type insertedTime
 */
/**
 * @property {String|Db.Expression}
 * @type updatedTime
 */
/**
 * @property {String}
 * @type access_token
 */
/**
 * @property {String}
 * @type session_secret
 */
/**
 * @property {String|Buffer}
 * @type session_expires
 */
/**
 * @property {String}
 * @type state
 */
/**
 * @property {String}
 * @type provider_uid
 */

/**
 * This method calls Db.connect() using information stored in the configuration.
 * If this has already been called, then the same db object is returned.
 * @method db
 * @return {Db} The database connection
 */
Base.db = function () {
	return Users.db();
};

/**
 * Retrieve the table name to use in SQL statements
 * @method table
 * @param {boolean} [withoutDbName=false] Indicates wheather table name should contain the database name
 * @return {String|Db.Expression} The table name as string optionally without database name if no table sharding was started
 * or Db.Expression object with prefix and database name templates is table was sharded
 */
Base.table = function (withoutDbName) {
	if (Q.Config.get(['Db', 'connections', 'Users', 'indexes', 'AppUser'], false)) {
		return new Db.Expression((withoutDbName ? '' : '{$dbname}.')+'{$prefix}app_user');
	} else {
		var conn = Db.getConnection('Users');
		var prefix = conn.prefix || '';
		var tableName = prefix + 'app_user';
		var dbname = Base.table.dbname;
		if (!dbname) {
			var dsn = Db.parseDsnString(conn['dsn']);
			dbname = Base.table.dbname = dsn.dbname;
		}
		return withoutDbName ? tableName : dbname + '.' + tableName;
	}
};

/**
 * The connection name for the class
 * @method connectionName
 * @return {string} The name of the connection
 */
Base.connectionName = function() {
	return 'Users';
};

/**
 * Create SELECT query to the class table
 * @method SELECT
 * @param {String|Object} [fields='*'] The fields as strings, or object of {alias:field} pairs
 * @param {String|Object} [alias=null] The tables as strings, or object of {alias:table} pairs
 * @return {Db.Query.Mysql} The generated query
 */
Base.SELECT = function(fields, alias) {
	fields = fields || '*';
	var q = Base.db().SELECT(fields, Base.table()+(alias ? ' '+alias : ''));
	q.className = 'Users_AppUser';
	return q;
};

/**
 * Create UPDATE query to the class table. Use Db.Query.Mysql.set() method to define SET clause
 * @method UPDATE
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.UPDATE = function(alias) {
	var q = Base.db().UPDATE(Base.table()+(alias ? ' '+alias : ''));
	q.className = 'Users_AppUser';
	return q;
};

/**
 * Create DELETE query to the class table
 * @method DELETE
 * @param {object}[table_using=null] If set, adds a USING clause with this table
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.DELETE = function(table_using, alias) {
	var q = Base.db().DELETE(Base.table()+(alias ? ' '+alias : ''), table_using);
	q.className = 'Users_AppUser';
	return q;
};

/**
 * Create INSERT query to the class table
 * @method INSERT
 * @param {object} [fields={}] The fields as an associative array of `{column: value}` pairs
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.INSERT = function(fields, alias) {
	var q = Base.db().INSERT(Base.table()+(alias ? ' '+alias : ''), fields || {});
	q.className = 'Users_AppUser';
	return q;
};

/**
 * The name of the class
 * @property className
 * @type string
 */
Base.prototype.className = "Users_AppUser";

// Instance methods

/**
 * Create INSERT query to the class table
 * @method INSERT
 * @param {object} [fields={}] The fields as an associative array of `{column: value}` pairs
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.prototype.setUp = function() {
	// does nothing for now
};

/**
 * Create INSERT query to the class table
 * @method INSERT
 * @param {object} [fields={}] The fields as an associative array of `{column: value}` pairs
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.prototype.db = function () {
	return Base.db();
};

/**
 * Retrieve the table name to use in SQL statements
 * @method table
 * @param {boolean} [withoutDbName=false] Indicates wheather table name should contain the database name
 * @return {String|Db.Expression} The table name as string optionally without database name if no table sharding was started
 * or Db.Expression object with prefix and database name templates is table was sharded
 */
Base.prototype.table = function () {
	return Base.table();
};

/**
 * Retrieves primary key fields names for class table
 * @method primaryKey
 * @return {string[]} An array of field names
 */
Base.prototype.primaryKey = function () {
	return [
		"userId",
		"provider",
		"appId"
	];
};

/**
 * Retrieves field names for class table
 * @method fieldNames
 * @return {array} An array of field names
 */
Base.prototype.fieldNames = function () {
	return [
		"userId",
		"provider",
		"appId",
		"insertedTime",
		"updatedTime",
		"access_token",
		"session_secret",
		"session_expires",
		"state",
		"provider_uid"
	];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_userId
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_userId = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Buffer))
			throw new Error('Must pass a String or Buffer to '+this.table()+".userId");
		if (typeof value === "string" && value.length > 31)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".userId");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the userId field
	 * @return {integer}
	 */
Base.prototype.maxSize_userId = function () {

		return 31;
};

	/**
	 * Returns schema information for userId column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_userId = function () {

return [["varbinary","31","",false],false,"PRI",""];
};

/**
 * Method is called before setting the field and verifies if value belongs to enum values list
 * @method beforeSet_provider
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' does not belong to enum values list
 */
Base.prototype.beforeSet_provider = function (value) {
		if (value instanceof Db.Expression) return value;
		if (['native','facebook','twitter','google','yahoo'].indexOf(value) < 0)
			throw new Error("Out-of-range value "+JSON.stringify(value)+" being assigned to "+this.table()+".provider");
		return value;
};

	/**
	 * Returns schema information for provider column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_provider = function () {

return [["enum","'native','facebook','twitter','google','yahoo'","",false],false,"PRI",null];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_appId
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_appId = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number")
			throw new Error('Must pass a String to '+this.table()+".appId");
		if (typeof value === "string" && value.length > 200)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".appId");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the appId field
	 * @return {integer}
	 */
Base.prototype.maxSize_appId = function () {

		return 200;
};

	/**
	 * Returns schema information for appId column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_appId = function () {

return [["varchar","200","",false],false,"PRI",null];
};

/**
 * Method is called before setting the field
 * @method beforeSet_insertedTime
 * @param {String} value
 * @return {Date|Db.Expression} If 'value' is not Db.Expression the current date is returned
 */
Base.prototype.beforeSet_insertedTime = function (value) {
		if (value instanceof Db.Expression) return value;
		value = (value instanceof Date) ? Base.db().toDateTime(value) : value;
		return value;
};

	/**
	 * Returns schema information for insertedTime column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_insertedTime = function () {

return [["timestamp","200","",false],false,"","CURRENT_TIMESTAMP"];
};

/**
 * Method is called before setting the field
 * @method beforeSet_updatedTime
 * @param {String} value
 * @return {Date|Db.Expression} If 'value' is not Db.Expression the current date is returned
 */
Base.prototype.beforeSet_updatedTime = function (value) {
		if (value == undefined) return value;
		if (value instanceof Db.Expression) return value;
		value = (value instanceof Date) ? Base.db().toDateTime(value) : value;
		return value;
};

	/**
	 * Returns schema information for updatedTime column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_updatedTime = function () {

return [["timestamp","200","",false],true,"",null];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_access_token
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_access_token = function (value) {
		if (value == undefined) return value;
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number")
			throw new Error('Must pass a String to '+this.table()+".access_token");
		if (typeof value === "string" && value.length > 1023)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".access_token");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the access_token field
	 * @return {integer}
	 */
Base.prototype.maxSize_access_token = function () {

		return 1023;
};

	/**
	 * Returns schema information for access_token column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_access_token = function () {

return [["varchar","1023","",false],true,"",null];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_session_secret
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_session_secret = function (value) {
		if (value == undefined) return value;
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number")
			throw new Error('Must pass a String to '+this.table()+".session_secret");
		if (typeof value === "string" && value.length > 1023)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".session_secret");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the session_secret field
	 * @return {integer}
	 */
Base.prototype.maxSize_session_secret = function () {

		return 1023;
};

	/**
	 * Returns schema information for session_secret column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_session_secret = function () {

return [["varchar","1023","",false],true,"",null];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_session_expires
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_session_expires = function (value) {
		if (value == undefined) return value;
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Buffer))
			throw new Error('Must pass a String or Buffer to '+this.table()+".session_expires");
		if (typeof value === "string" && value.length > 255)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".session_expires");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the session_expires field
	 * @return {integer}
	 */
Base.prototype.maxSize_session_expires = function () {

		return 255;
};

	/**
	 * Returns schema information for session_expires column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_session_expires = function () {

return [["varbinary","255","",false],true,"",null];
};

/**
 * Method is called before setting the field and verifies if value belongs to enum values list
 * @method beforeSet_state
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' does not belong to enum values list
 */
Base.prototype.beforeSet_state = function (value) {
		if (value instanceof Db.Expression) return value;
		if (['visited','added','removed'].indexOf(value) < 0)
			throw new Error("Out-of-range value "+JSON.stringify(value)+" being assigned to "+this.table()+".state");
		return value;
};

	/**
	 * Returns schema information for state column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_state = function () {

return [["enum","'visited','added','removed'","",false],false,"","visited"];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_provider_uid
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_provider_uid = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number")
			throw new Error('Must pass a String to '+this.table()+".provider_uid");
		if (typeof value === "string" && value.length > 200)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".provider_uid");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the provider_uid field
	 * @return {integer}
	 */
Base.prototype.maxSize_provider_uid = function () {

		return 200;
};

	/**
	 * Returns schema information for provider_uid column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_provider_uid = function () {

return [["varchar","200","",false],false,"",null];
};

/**
 * Check if mandatory fields are set and updates 'magic fields' with appropriate values
 * @method beforeSave
 * @param {Object} value The object of fields
 * @param {Function} callback Call this callback if you return null
 * @return {Object|null} Return the fields, modified if necessary. If you return null, then you should call the callback(err, modifiedFields)
 * @throws {Error} If e.g. mandatory field is not set or a bad values are supplied
 */
Base.prototype.beforeSave = function (value) {
	var fields = ['provider','appId'], i;
	if (!this._retrieved) {
		var table = this.table();
		for (i=0; i<fields.length; i++) {
			if (this.fields[fields[i]] === undefined) {
				throw new Error("the field "+table+"."+fields[i]+" needs a value, because it is NOT NULL, not auto_increment, and lacks a default value.");
			}
		}
	}
	// convention: we'll have updatedTime = insertedTime if just created.
	this['updatedTime'] = value['updatedTime'] = new Db.Expression('CURRENT_TIMESTAMP');
	return value;
};

module.exports = Base;