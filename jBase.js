/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery-ui-1.8.20.js" />


//This library is also trying to work in the same manner of c# by using things such as function/method overriding.

(function () {
	if (!String.prototype.format) {
		var regexes = {};
		String.prototype.format = function (parameters) {
			for (var formatMessage = this, args = arguments, i = args.length; --i >= 0;)
				formatMessage = formatMessage.replace(regexes[i] || (regexes[i] = RegExp("\\{" + (i) + "\\}", "gm")), args[i]);
			return formatMessage;
		};
		if (!String.format) {
			String.format = function (formatMessage, params) {
				for (var args = arguments, i = args.length; --i;)
					formatMessage = formatMessage.replace(regexes[i - 1] || (regexes[i - 1] = RegExp("\\{" + (i - 1) + "\\}", "gm")), args[i]);
				return formatMessage;
			};
		}
	}
})();

(function($) {
	// global is the this object, which is window when running in the usual browser environment.
	"use strict";

	var errorMsg = null;
	
	//constructor
	$.jBase = function ()
	{
		var jbase, caller,
			self_ = {
				key: 0,
				useKey: "",
				id: "",
				bnds: {}				
			},
			self = {
				data: "",
				map: "",
				ctx: "",
				type: "",
				// If the data is an array, this is an 'array view' with a views array for each child 'item view'
				// If the data is not an array, this is an 'item view' with a views 'map' object for any child nested views
				// ._.useKey is non zero if is not an 'array view' (owning a data array). Uuse this as next key for adding to child views map
				//get: getInstance,
				//getIndex: getIndex,
				//getRsc: getResource,
				//hlp: getHelper,
				_: self_,
				_is: "jBase",
				tables: {}
			}
		
		this.newTable = function ()
		{
			var params = [],
				numberOfArguments,
				_table = null;

			//get the number of arguments given by the user. If none, then default to zero.
			numberOfArguments = typeof (arguments) !== 'undefined' ? arguments.length : 0;

			//#region process the arguments
			switch (numberOfArguments)
			{
				//if only one argument is given, then call teh default constructor
				case 1:
					if (typeof arguments[0] == 'string')
					{
						
						_table = new TableConstructor(arguments[0]);

						if (typeof (_table) == 'object')
						{
							console.log(String.format("Created new empty table '{0}'.", _table.tableName));
						}
						console.log(String.format("Created new empty table '{0}'.", arguments[0]));
					}
					break;
				case 2:
					if (typeof arguments[0] == 'string')
					{
						_table = creatTable(arguments[0], arguments[1]); //can be called as statc or to return the table instance.
						if (typeof (_table) == 'object')
						{
							console.log(String.format("Created new empty table '{0}'.", _table.tableName));
						}
						console.log(String.format("Created new empty table '{0}'.", arguments[0]));
					}
				case 4:
					
					_table = new TableConstructor(arguments[0], arguments[1], arguments[2], arguments[3]);

					if (typeof (_table) == 'object')
					{
						console.log(String.format("Created new empty table '{0}'.", _table.tableName));
					}
					console.log(String.format("Created new empty table '{0}'.", arguments[0]));
	
					break;
			}
			//#endregion

		}

		this.getTable = function ()
		{
			var numberOfArguments,
				numberOfRows,
				_table = null;

			//get the number of arguments given by the user. If none, then default to zero.
			numberOfArguments = typeof (arguments) !== 'undefined' ? arguments.length : 0;

			
			if (typeof arguments[0] == 'string' && arguments.length == 1)
			{
				_table = getTableFromStorage(arguments[0]);
				if (!!_table && _table instanceof Object)
				{
					_table.RowCount = typeof ( _table.Rows ) != 'undefined' ?
						_table.Rows.length :0;

					return _table;
				}
				else
				{
					console.error(String.format("A table with the name '{0}' does not exist!", arguments[0]));
				}
			}
			else
			{
				console.log("You must supply one parameter of type string as the table name when using the function getTable().");
			}
		}
		
	};

	//#region private functions

		//#region Create Table

	//Creates a blank table that is named.
	function creatTableOld(tableName, forceNew)  //initiliase new table that is empty and just name it.
	{
		var _table = [],
			doesTableNameExist;  //maybe do one item that holds all. somthing like key "jBasedata" domain specific? Come back to this...

		console.log(String.format("Initlializing new empty table '{0}'...", tableName));

		doesTableNameExist = localStorage.getItem(tableName);

		if (!!doesTableNameExist && !forceNew)
		{
			errorMsg = String.format("That table name is already used! You cannot have two tables with the name {0}", tableName);
			console.error(errorMsg);
			return errorMsg;
		}
		else
		{
			if (!!_table)
			{
				_table.tableName = tableName;
				localStorage.setItem(tableName, JSON.stringify(_table));
				console.log(String.format("Storing new table '{0}'.", tableName));

				return _table;
			}
		}
	}

	///default constructor to create  a new table
	function TableConstructor(tableName, columns, rows, forceNew)
	{
		///tableName: The name of the table, columns: Delimiter string, array, or object  with the column names, 
		var doesTableNameExist;

		this.TableName = tableName;
		this.Columns = columns;
		this.Rows = rows;
		this.RowCount = 0;

		doesTableNameExist = localStorage.getItem(tableName);

		if (!!doesTableNameExist && !forceNew)
		{
			errorMsg = String.format("That table name is already used! You cannot have two tables with the name {0}", tableName);
			console.error(errorMsg);
		}
		else
		{
			//create the object table and store it after running JSON against it.
			localStorage.setItem(this.TableName, JSON.stringify(this));
			console.log(String.format("Storing new table '{0}'.", this.tableName));
		}
	}

	//arguments sent as an array. breakdown the arguments, and build the table. Example: {"UserID", "Name", "Email"}
	function createTableFromArray(tableName, columns)
	{
		var cols,
			_instance = [];

		if (columns instanceof Array)
		{
			var cols = columns,
				c;

			for (c = 0; c < cols.length; c++)
			{
				var _newColumn = new Object();

				_newColumn.ColumnName = cols[c];
				_newColumn.ColumnData = new Array();
				_newColumn.ColumnData.length = 1; //initialize array
				_newColumn.Required = true;

				_instance.push(_newColumn); //add the column object to the table instance....
			}
		}

		return _instance;
	}

	//#region table sent as object
	//table arguments sent as an object. breakdown the arguments, and build the table. {UserName:, Name:, Email:}
	function createTableFromObject(tableName, tableObject)
	{
		if (columns instanceof Object)
		{
			for (var property in object)
			{

			}
			for (c = 0; c < cols.length; c++)
			{
				var _newColumn = new Object();

				_newColumn.ColumnName = cols[c];
				_newColumn.ColumnData = new Array();
				_newColumn.ColumnData.length = 1; //initialize array
				_newColumn.Required = true;

				_instance.push(_newColumn); //add the column object to the table instance....
			}
		}

		//instance arguments sent as a string. breakdown string, and build the table. example "UserID, Name, Email"
		if (columns instanceof String)
		{
			_instance[0] = columns;
			if (data)
			{
				if (data instanceof String)
				{
					var _rows = []; //array to hold the row(s) when finished going through them.
					//the user push a string csller through, so we need to see if multipl roms exist, or one row only
					if (data.indexOf(";") > 0) //we now know there are multiple rows of data
					{
						var rows = data.split(";");
						for (var sPosition = 0; sPosition < rows.length; sPosition++)
						{
							var columRowEntries = rows[sPosition].split(",");
							if (columRowEntries > columns.split(",").length)
							{
								//to many entries per column!
								console.log(String.format("The length of data entries in the row cannot be more than the amount of columns in the table!. Columns:{0}, RowItems:{1}  [{2}]", columns, columns.split(",").length, rows[sPosition]));
							}
							else
							{
								_instance.push(); //now break out the columns in the current row section
							}
						}
					}
				}
			}
		}

	}

	//#endregion

	//#endregion

		//#region Get Table

	//get a geric instance of the table.
	function getTableFromStorage(tableName)  //initiliase new table that is empty and just name it.
	{
		var _table = {},
			tableDataItem;

		console.log(String.format("Getting instance of table '{0}'...", tableName));

		tableDataItem = localStorage.getItem(tableName);
		if (!!tableDataItem)
		{
			_table = JSON.parse(tableDataItem);
		}
		else
		{
			errorMsg = String.format("That table name is already used! You cannot have two tables with the name {0}", tableName);
			console.error(errorMsg);
		}
		return _table;
	}

		//#endregion

		//#region miscallanious 

	//check if array is multi-demensional
	function IsArryMultiDemensional($array)
	{
		if (typeof ($array) != 'undefined')
		{
			if ($array.length > 0)
			{
				if (typeof ($array[0]) != 'undefined')
				{
					if ($array[0] instanceof Array)
					{
						return true;
					}
				}
			}
		}
		return false;
	}

		//#endregion 

	//#endregion

})(jQuery)
	
var DataManager = new $.jBase();


