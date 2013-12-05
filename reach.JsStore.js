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



//////////////////////////////////////////////////////////
//
//	NOTES
//
//	1. use a gloabl counter, and increment all items on load, 
//	   so we are not relying on user entering id, or another attribute to make them unique. 
//		It will start from zero, and increment up adding attributes [reach-key] on the items they send into the plugin.
//
//
//
//
//
//////////////////////////////////////////////////////////

"use strict";

(function ()
{
	//used non-standard naming scheme to minimize globbering
	if (!String.prototype.reachStringFormat)
	{
		var regexes = {};
		String.prototype.reachStringFormat = function (parameters)
		{
			for (var formatMessage = this, args = arguments, i = args.length; --i >= 0;)
				formatMessage = formatMessage.replace(regexes[i] || (regexes[i] = RegExp("\\{" + (i) + "\\}", "gm")), args[i]);
			return formatMessage;
		};
		if (!String.reachStringFormat)
		{
			String.reachStringFormat = function (formatMessage, params)
			{
				for (var args = arguments, i = args.length; --i;)
					formatMessage = formatMessage.replace(regexes[i - 1] || (regexes[i - 1] = RegExp("\\{" + (i - 1) + "\\}", "gm")), args[i]);
				return formatMessage;
			};
		}
	}
})();


(function ($)
{
	var _config;
	var _uniqueID = undefined;

	var propertyToStore = {
		reachKey: "reach-key",
		id: "id"
	}

	$.reach = function ( $_items, options )
	{
		this.options = {};

		$_items.data('reach', this);

		this.init = function ($_items, options, _selector)
		{
			this.options = $.extend({}, $.reach.defaultOptions, options);
				
			this.options.domStorage = (typeof ( Storage ) !== "undefined");
				
			//only load cookie library if needed
			//if (!this.options.domStorage)
			//{
			//	if (!$.cookie)
			//	{
			//		var jq = document.createElement('script');
			//		jq.type = 'text/javascript';
			//		jq.src = 'https://raw.github.com/carhartl/jquery-cookie/master/jquery.cookie.js';  //if jQuery.cookie is not loaded, then we will grab the publically hosted libray
			//		document.getElementsByTagName('head')[0].appendChild(jq);
			//	}
			//}

			//Call private function
			//prep(element, this.options);

			//check for unique ids, if not, then add them dynamically or use custom attribute. We have to keep traack of this,
			//so that they do not get globbered by other elemetns and data.
			//So, we keep the dynamic id's based off the global count, and also the cusotm attributes in a global array for 
			//referencing repeat items or duplicates. 
			$.each($_items, function (n, e)
			{
				//if (!this.id)
				//{
					if (!$(this).attr('reach-key'))
					{
						var nextKey = typeof (_uniqueID) === 'undefined' ? _uniqueID = 0 : getUniqueId();
					}

					$(window).data("reach-global-max", nextKey); //keep track of the global counter
					$(this).attr("propertyToStore", propertyToStore.reachKey);
				//}
				//else
				//{
				//	//we are using the attribute [id] for preserving it in local storage. Next we need to now make sure there isn't a conflicting object with this qualifier.
				//	$(this).attr("propertyToStore", propertyToStore.id);
				//}
			});

			applySortable($_items, this.options.sortableConfig, _selector);

			getState($_items);
		};			

		this.init($_items, options);
	};
	 
	$.fn.reach = function (options)
	{			
		
		return new $.reach($(this), options, this.selector);
		
	};

	$.reach.setState = function ( target )
		{
			/// <summary>Preserves the current state of the items.</summary>
			/// <param name="target" type="String/Object">Can either send a string selector or a jquery object of items.</param>
			/// <returns type="Instance of Table">The table in context.</returns>
			if (!!target)
			{
				var $elements;

				switch (typeof ( target ))
				{
					case 'object':
						$elements = target;
						break;
					case 'stirng':
						$elements = $(target);
						break;
				}
				updateState($elements);
			}
		}

	$.reach.getState = function ( target )
		{
			/// <summary>Checks the storage for this set of elements, and then rebuilds the items to the saved ordered state, and updates the elements in the DOM.</summary>
			/// <param name="elements" type="array/jqueryObject">REQUIRED:Elements to check against preserved order.</param>
			/// <returns type="null">Function of return type [void].</returns>
			if ( !!target )
			{
				var $elements;

				switch (typeof ( target ))
				{
					case 'object':
						$elements = target;
						break;
					case 'stirng':
						$elements = $(target);
						break;
				}
				getState($elements);
			}
		}

	function applySortable($_items, config, _selector)
		{
			//overwrite any "stop" function the user may have implemented. We use the 
			//stop function to handle writting the order out to storage.

			if (!!config)
			{
				config["stop"] = function (event, ui) { updateState($_items, _selector); };
			}

			$_items.sortable(config);

			processEffectedElements($_items, config);
		}

	function processEffectedElements($_items, config)
	{
		/// <summary>Checks if the elements have an id assigned to them for storage purposes. If not, then checks for a reach-key attribute. If not, it assigns a </summary>
		///<summary>value to the reach-key attribute.
		/// <param name="$_items" type="jqueryObject">REQUIRED:Elements to test for id/reach-key's.</param>
		/// <param name="$_items" type="jqueryObject">Object that is the extended sortable options. We need to check if there is a items property set or not.We do this so that we can find the elements affected by the sortable, to id them and store.</param>
		/// <returns type="null">Function of return type [void].</returns>
		var $elements = config["items"] || $_items.find(">*");
		if ($elements)
		{
			$.each($elements, function(n, e)
			{
				//if (!$(e).attr('id'))
				//{
					if (!$(e).attr("reach-key"))
					{
						$(e).attr("reach-key", String.reachStringFormat("{0}.{1}", $_items.prop("tagName"), getUniqueId()));
					}
				//}
			});
		}
	}

	function getUniqueId()
	{
		return _uniqueID += 1;
	}

	function updateState($_items, _selector)
	{
			/// <summary>Called when the sortable event [stop] is triggered. Updates the current order of elements and saves the order for future use.</summary>
			/// <param name="elements" type="array/jqueryObject">REQUIRED:Elements to get order.</param>
			/// <returns type="null">Function of return type [void].</returns>
			if (!!$_items && $_items.length)
			{
				var $context,
					itemKeys,
					_selector = $_items.selector || _selector;  //am going to extend this in later version. So placed logi like this.

				//if ($_items.prop("tagName").toLowerCase() == "ul")
				//{
				//	$context = $_items.find("li");
				//}
				//else
				//{
				//	$context = $_items;
				//}
				$context = $_items.find("[reach-key]");

				itemKeys = [];  //initalizing the array

				$.each($context, function (i, n)
				{
					itemKeys.push($(this).attr("reach-key"));  //may need to also check for ids in future. For now, use this attribute.
				});
				if (!!itemKeys && itemKeys.length)
				{
					localStorage.setItem(_selector, itemKeys.join(":"));
				}
			}
		};

	function getState($_items)
	{
		/// <summary>Checks the storage for this set of elements, and then rebuilds the items to the saved ordered state, and updates the elements in the DOM.</summary>
		/// <param name="elements" type="array/jqueryObject">REQUIRED:Elements to check against preserved order.</param>
		/// <returns type="null">Function of return type [void].</returns>
		var $returnList,
			$storedList,
			tmp;			

		if (localStorage.getItem( $_items.selector ))
		{

			tmp = localStorage.getItem( $_items.selector );
			$storedList = tmp.split(":");
			for (var index = 0; index < $storedList.length; index++)
			{
				var keyPair = $storedList[index];
				var keyVal = keyPair.substring(keyPair.indexOf(".") + 1);
				if ($_items.find("[reach-key='" + keyPair + "']"))
				{
					var copy = $_items.find("[reach-key='" + keyPair + "']").clone();
					$_items.find("[reach-key='" + keyPair + "']").remove();
					$_items.append(copy);
				}
					
			}
		}
	}

	function prep(selector, options)
		{
			//this is where we will check for unique id in the parent that has sortable children. If not, and does 
			//not have cusotm attributes setup [suggested scenario] such as [reach-key], then we dynamically add them.
			//we also do this based on a unique integer incrementation to be able to keep adding new elements to the current 
			//instance.  --- come back to this.

		};


	$.reach.defaultOptions = {
			class: 'reach-item',
			domStorage: undefined,
			sortableConfig: {
				stop: undefined,
				items: undefined
			}
		}

})(jQuery);	



























