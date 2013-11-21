/// <reference path="jquery-vsdoc.js" />

/*
* JDBase: Javascript wrapper for client side storage
*
* jDBase.js v1.0.0
* See https://github.com/caseypharr/jDBase
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

/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery-ui-1.8.20.js" />

(function ()
{
	//used non-standard naming scheme to minimize globbering
	if (!String.prototype.jDBaseFormat)
	{
		var regexes = {};
		String.prototype.jDBaseFormat = function (parameters)
		{
			for (var formatMessage = this, args = arguments, i = args.length; --i >= 0;)
				formatMessage = formatMessage.replace(regexes[i] || (regexes[i] = RegExp("\\{" + (i) + "\\}", "gm")), args[i]);
			return formatMessage;
		};
		if (!String.jDBaseFormat)
		{
			String.jDBaseFormat = function (formatMessage, params)
			{
				for (var args = arguments, i = args.length; --i;)
					formatMessage = formatMessage.replace(regexes[i - 1] || (regexes[i - 1] = RegExp("\\{" + (i - 1) + "\\}", "gm")), args[i]);
				return formatMessage;
			};
		}
	}
})();

Array.prototype.contains = function (obj)
{
	var i = this.length;
	while (i--)
	{
		if (this[i] === obj)
		{
			return true;
		}
	}
	return false;
}


(function($)
{

	"use strict";
	var settings = {
		delimeter: "0x2C" //   ","
	};	

	$.jDBase = function() 	
	{
		///THis is used to wrap the localStorage API and handleit in a mre suitable
		///way for managing preserved data in a familiar concept,
		///that is managable with nigger amounts of data.

		
		//The tables of the current DataManager session
		this.Tables = [],
		//method to create a table
		this.NewTable = function (tableName, columns, data)
		{
			return new Table(tableName, columns, data);
		}
		
	}


	//#region Methods


	function Table(tableName, columns, data)
	{

		this.Rows = [];
		this.Columns = [];
		this.TableName = "";
		//this.AddRow = function (row)
		//{
		//	this.Rows.push(row);
		//}

		if (typeof tableName === "string")
		{
			this.TableName = tableName;
		}
		if (columns)
		{
			var getType = typeof columns !== "object" ? columns.Split(settings.delimeter)
				: columns;

			this.Columns = getType;
		}
		if (data)
		{
			if (typeof data === "object" && typeof data[0] !== "undefined")
			{
				//  We need an array for the rows/data. They are arrays of objects with property vlaues
				//  and column as property names
				var columnTest = this.Columns[0];
				if (data[0][columnTest])
				{
					for (var ri = 0; ri < data.length; ri++)
					{
						var rowItems = []; //type row items

						for (var property in data[ri])
						{
							var rowItem = new RowItem(data[ri][property]);
							rowItem.Column = property;
							rowItems.push(rowItem);
						}
						this.Rows.push(rowItems);
					}
				}
			}
		}

		this.AddRow = function (rowData)
		{
			var badData,
				isValidType = typeof (rowData) === "object" && typeof (rowData.length) === "undefined";

			// is the row an object type meaning an array or an object?
			if (typeof rowData === "object")
			{
				var rowItems = [];
				for (var columnName in rowData)
				{											
					var rowItem = new RowItem(rowData[columnName]);
					rowItem.Column = columnName;
					rowItems.push(rowItem);
				}
				if (rowItems.length != undefined)
				{
					this.Rows.push(rowItems);
				}

			}
		}

		this.DeleteRow = function (row)
		{
			if (typeof (arguments[0]) === "string")
			{
				DeleteQuesryString(arguments[0]);
			}
			else
			{
				DeleteInstance(arguments[0]);
			}
		}
	}

	function Row(rowData)
	{
		this.Key = null;
		this.Columns = null;
		this.Data = [];  //typeof RowItems
		this.GetData = function ()
		{
		}
		if (rowData)
		{

		}
	}

	function RowItem(item)
	{
		//is this possible? To break it down to ro
		this.ItemValue = item;
	}

	function _InitializeTable(_table)
	{
		this.Rows = [];   //   array that holds objects [rows]
		this.Columns = {};  //array value with column
		this.TableName = "";
		this.AddRow = function (row)
		{
			var _row = new Row(row);
			this.Rows.push(row);
		}

	}



	//#endregion
}(jQuery)) 
