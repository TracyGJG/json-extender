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
* Attempting to serialise BigInt [5] values result in an exception to be thrown [6].
* Map [7] and Set [8] instances cannot be captured in the JSON format.
* Custom objects (Classes) need to be preprocessed before they can be stored in JSON, for which a toJSON  method can be created.

## JSON Extenders


## References
1. [JSON Official Website](https://www.json.org/json-en.html)
1. [ECMA-404: The JSON data interchange syntax](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)
1. [IEEE 754: Standard for Floating-Point Arithmetic](https://standards.ieee.org/ieee/754/6210/)
1. [toJSON method of the Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON)
1. [BigInt as defined in MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
1. [BigInt stringify exception](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#exceptions)
1. [Map objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
1. [Set objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)


[BSON - Binary JSON specification](https://bsonspec.org/)