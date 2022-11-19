# json-extenders
Utilities to extend the range of data types that can be de-serialisable into JSON (JavaScript Object Notation) [1].

## Motivation
The JSON data format is quite straightforward, which is probably one of the reasons for its popularity. Although it was derived from JavaScript it has been widely adopted for use by other technology stacks due to the simplicity of the format [2].

However, the number of data types that can be used to store values is limited to four (well three):
* null - no value or type
* Boolean - true or false
* number - numeric values according to the IEEE [3] standard
* string - a consecutive list of characters delimited by double-quotes

Data is not stored as a simple list of values but there are two data structures that can be used interchangably.
* Array - a list of zero or more values, not necessarily of the same type, separated with a comma and delimited by square-brackets. Values in an array can be referenced by their position/index in the array, offset from zero.
* Object - a list of zero or more key-values pairs, separated by commas and delimited by curly-brackets. The order of the key-value pairs is not significant or gaurenteed to be retained.

These structures are known by many other names in other programming languages.

## Limitations
The serialisation (strigify) and deserialisation (parse) of JSON in JavaScript is quite capable and standards compliant but the format is limited.
* Data (values) without value (or type) [or do not exist as a property of an object] are assigned a 'value' of _undefined_. Such values cannot normally exist in JSON and will be excluded during the conversion to a JSON string.
* Dates are converted to their ISO string format via their toJSON [4] method, which is also available on URL objects. However, there is a loss of distiction between date-times that were supplied as strings from the outset (e.g. timestamps) and those that originated from Date objects.
* Regular Expression (RegExp) [5] objects are excluded from the stringified object.
* Attempting to serialise BigInt [6] values result in an exception to be thrown [7].
* Map [8] and Set [9] instances cannot be captured in the JSON format.
* Custom objects (Classes) can require some pre-processed before being stored in JSON, for which a toJSON  method can be created. Equally, deserialisation of custom objects require post-processing before re-instantiation.

## Extension
This module provides two levels of extension called enhanced and customised.

### Enhanced
This functionality makes it possible to serialise the following data types as part of a JSON string and deserialise it back into a JS Object.
* undefined
* BigInt
* Date object
* RegExp object
* Map object
* Set object

### Customised
Application-specific classes can be serialised/deserialised by providing custom replacer/reviver functions to the utility functions.

#### Custom replacer (serialisation)
takes in a single value that is an object (instance) of a custom class. The function processes the instance and returns either;
* a stringified simplified object comprisong of a selection of properties
* the value 'undefined' if the class is to be excluded from the serialised output
* or 'false' if the object is to be retained unmodified.

#### Custom reviver (deserialisation)
takes a single object parameter that comprises of two properties: className and instance.
* The className is the text string version of the name of the class from which the instance derives.
* The instance, it self stringified, of simplified object extracted from the original custom object.

## References
1. [JSON Official Website](https://www.json.org/json-en.html)
1. [ECMA-404: The JSON data interchange syntax](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)
1. [IEEE 754: Standard for Floating-Point Arithmetic](https://standards.ieee.org/ieee/754/6210/)
1. [toJSON method of the Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON)
1. [RegExp - Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
1. [BigInt as defined in MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
1. [BigInt stringify exception](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#exceptions)
1. [Map objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
1. [Set objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
