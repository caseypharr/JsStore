/// <reference path="jquery-vsdoc.js" />
/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery-ui-1.8.20.js" />


/* JsStore: Javascript wrapper for client side storage
*
* JsStore.js v1.0.0
* See https://github.com/caseypharr/JsStore
* 
* ©Copyright 2013, Casey Pharr
* 
* Released under the GNU (General Public License.)
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.

* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//#region misc

(function ()
{
	//used non-standard naming scheme to minimize globbering
	if (!String.prototype.jDBaseStringFormat)
	{
		var regexes = {};
		String.prototype.jDBaseStringFormat = function (parameters)
		{
			for (var formatMessage = this, args = arguments, i = args.length; --i >= 0;)
				formatMessage = formatMessage.replace(regexes[i] || (regexes[i] = RegExp("\\{" + (i) + "\\}", "gm")), args[i]);
			return formatMessage;
		};
		if (!String.jDBaseStringFormat)
		{
			String.jDBaseStringFormat = function (formatMessage, params)
			{
				for (var args = arguments, i = args.length; --i;)
					formatMessage = formatMessage.replace(regexes[i - 1] || (regexes[i - 1] = RegExp("\\{" + (i - 1) + "\\}", "gm")), args[i]);
				return formatMessage;
			};
		}
	}
})();


"use strict";

var s;

var JsStore = {
	
	settings: {
		delimeter: "0x2C",
		storagePrefix: "jstor:",
		storageType: "localStorage"
	},

	init: function() {

		if (!window.jQuery)
		{
			var jq = document.createElement('script'); 
			jq.type = 'text/javascript';
			jq.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';  //if jQuery is not loaded, then we will grab the publically hosted libray
			document.getElementsByTagName('head')[0].appendChild(jq);
		}
		if(typeof(Storage) === "undefined")
		{
			this.trigger("onError", "The current browser does not support the local storage API");
		}
	},
	tableManager: {
		newTable: function( tableName, columns )
		{
			/// <summary>Creates a new table as instanceof type "Table". The default constructor takes two arguments [TABLENAME] and [COLUMNS]. When a new table is initialized,</summary>
			///<summary>it is returned as a instance of Table, and is also pushed into the Tables property array. This means you do not have to define it to a object at the moment. You can retrieve the tqable later in memory.</summary>
			/// <param name="tableName" type="String">REQUIRED:The name of the table, and will be the storage key for future retrieval.</param>
			/// <param name="columns" type="String/Object">If in string format, send a string of column names using the gloablly set delim character. If you are sending an object, the property names will be stripped out, and will be the column names.</param>
			/// <returns type="Instance of Table">The table in context.</returns>
			return new Table( paramObj );
		},
		getTable: function( params )
		{
			/// <summary>Creates a new table as instanceof type "Table". The default constructor excepts an object as the parameters. This object is extended ot the default settings.</summary>
			/// <param name="options" type="Object">The settings for the constructor. Properties should be [NAME],[COLUMNS]: In array or string delim by comma formats,[ROWS]: An array of objects, with property names the column id, and then value.</param>
			/// <returns type="Instance of Table">The table in context.</returns>
			return JsStore.storageHandler.get( arguments );
		},
		setTable: function( params )
		{
			/// <summary>Stores the current table in the local storage database. If the table is already stored, it overwrites it by default. Change the gloab settings modify this.</summary>
			/// <param name="type" type="string">Defines what type of storage call we will be making.</param>
			/// <returns type="String">If a non null/string value is returned, then an error occured durring the call to set the table in storage.</returns>
			return JsStore.storageHandler.set(type, params);
		},
		deleteTable: function( params )
		{
			
		}
		
	},
	storageHandler: {
		get: function( type, params )
		{
			//cycle throug different ways to get the kesy for different types. Then retunr the 
			//data within the localStorage object.

		},
		set: function( type, params )
		{
			//we need to clean up the object before we can store it. We want all non-data properties to
			//be removed. Then we can JSON and store.
			var data = params;
			if(data instanceof Table)
			{
				var _jsonTable;
				//go through all of the row entities, and convert them to regular data object with no functions for
				//a JSON compatible object
				for(var r = 0; r < params.rows.length;r++)
				{
					_jsonTable.push(params["rows"][r]);
				}
				if(!!_jsonTable && _jsonTable.length > 0)
				{
					localStorage.setItem( params.Name, this.serialize(_jsonTable) );  //We just stored a serialized string instance of the table
				}
			}
		},
		serialize: function(param)
		{
			return $.JSON.stringify(param);
		},
		cleanObject: function(objectInstance){
			//we now transform the object instance to be able to be ran thorugh JSON handler.
			//anything non-data related needs to be removed, so it can be parsed correctly.
		},
		restoreObject: function(objectInstance)
		{

		}
	},	
	helpers: {

		_trigger: function (event, data)
		{
			//call or "invoke" a custom event of the JsStore entity
			this[event](data);
		},
		_onError: function (functionCallee, stringMessage, data, error)
		{
			//build a error instance or object here to handle the error
			return {
				message: stringMessage,
				target: target,
				cause: data
			}
		}
	}

}

	

//#region old
	//function $jDBase()
	//{
	//	this._onError = function(error)
	//	{
	//		console.error(error.message);
	//		event = new Event();
	//		event.
	//	}
	//	this.createTable = function (paramObj)
	//	{
	//		/// <summary>Creates a new table as instanceof type "Table". The default constructor excepts an object as the parameters. This object is extended ot the default settings.</summary>
	//		/// <param name="options" type="Object">The settings for the constructor. Properties should be [NAME],[COLUMNS]: In array or string delim by comma formats,[ROWS]: An array of objects, with property names the column id, and then value.</param>
	//		/// <returns type="Instance of Table">The table in context.</returns>
	//		return new Table(paramObj);
	//	}

	//	this.deleteTableByName = function (tablename)
	//	{
	//		/// <summary>Deletes a table as instanceof type "Table".+</summary>
	//		/// <param name="options" type="Object">The settings for the constructor. Properties should be [NAME],[COLUMNS]: In array or string delim by comma formats,[ROWS]: An array of objects, with property names the column id, and then value.</param>
	//		/// <returns type="Instance of Table">The table in context.</returns>
	//		return deleteTable(tableName);
	//	}





	//	function Table(optionsObj)
	//	{
	//		/// <summary>Creates a new table as instanceof type "Table". The default constructor excepts an object as the parameters. This object is extended ot the default settings.</summary>
	//		/// <param name="options" type="Object">The settings for the constructor. Properties should be [NAME],[COLUMNS]: In array or string delim by comma formats,[ROWS]: An array of objects, with property names the column id, and then value.</param>
	//		/// <returns type="Instance of Table">The table in context.</returns>
	//		var _rows,
	//			_columns,
	//			_name,
	//			defaults = {
	//				Name: null,
	//				Columns: [],
	//				Rows: []
	//			}
			
	//		if (!!optionsObj)
	//		{
	//			$.extend(defaults, optionsObj);
	//		}		
	//		if (!!_columns && typeof _columns === "string")
	//		{
	//			_columns = _columns.split($configuration.SplitCharacter);
	//		}
	//		if (!!data)
	//		{
	//			if (typeof data[0] !== "undefined")
	//			{
	//				//  We need an array for the rows/data. They are arrays of objects with property vlaues
	//				//  and column as property names
	//				var columnTest = _columns[0];
	//				if (data[0][columnTest])
	//				{
	//					for (var ri = 0; ri < data.length; ri++)
	//					{
	//						var rowItems = []; //type row items

	//						for (var property in data[ri])
	//						{
	//							var rowItem = new RowItem(data[ri][property]);
	//							rowItem.Column = property;
	//							rowItems.push(rowItem);
	//						}
	//						_rows.push(rowItems);
	//					}
	//				}
	//			}
	//		}

	//		//apply the new properties
	//		this.Rows = _rows;
	//		this.Columns = _columns;
	//		this.Name = _name;

	//		//assure the instance is returned.
	//		return this;
	//	}

	//	Table.prototype.AddRow = function (params)
	//	{
	//		var badData,
	//			isValidType = typeof (params) === "object" && typeof (params.length) === "undefined";

	//		// is the row an object type meaning an array or an object?
	//		if (typeof params === "object")
	//		{
	//			var rowItems = [];
	//			for (var columnName in params)
	//			{
	//				var rowItem = new RowItem(params[columnName]);
	//				rowItem.Column = columnName;
	//				rowItems.push(rowItem);
	//			}
	//			if (rowItems.length != undefined)
	//			{
	//				this.Rows.push(rowItems);
	//			}

	//		}
	//	}

	//	Table.prototype.GetRow = function (params)
	//	{
	
	//	}

	//	Table.prototype.DeleteRow = function (row)
	//	{
	//		if (typeof (arguments[0]) === "string")
	//		{
	//			DeleteQuesryString(arguments[0]);			
	//		}
	//		else
	//		{
	//			DeleteInstance(arguments[0]);
	//		}
	//	}

	//	function deleteTable(args)
	//	{
	//		var returnVal;
	//		switch(typeof args)
	//		{
	//			case "string":
	//				returnVal = RemoveData(args);
	//				break;
	//			case "object":
	//				if(!!args.length)
	//				{
	//					returnVal = "Error deleting table. You must provide a tablename or a table instance."
	//				}
	//				else
	//				{
	//					for(prop in args)
	//					{
	//						if(args["Name"] && args instanceof Table)
	//						{
	//							returnVal = RemoveData(args["Name"]);
	//						}
	//						else
	//						{
	//							returnVal = "Error deleting table. You must provide a tablename or a table instance. The object supplied is not of insatnce [Table]";
	//						}
	//					}
	//				}
	//				break;
	//			default:
	//				returnVal = "Error deleting table. You must provide a tablename or a table instance. Invalid argument passed"
	//				break;
	//		}
			
	//	}

	//	function Row(rowData)
	//	{
	//		this.Key = null;
	//		this.Columns = null;
	//		this.Data = [];  //typeof RowItems		
	//	}

	//	function RowItem(item)
	//	{
	//		//is this possible? To break it down to rowItem
	//		this.ItemValue = item;
	//	}

	//	function RemoveData(key)
	//	{
	
	//	}
	//}


//#endregion	










