const DEFAULT_PREFIX = 'JSON_EXTENSION';

// Serialisation
export function jsonReplacer(customPrexif = DEFAULT_PREFIX, _customReplacer) {
	return function (key, value) {
		if (value === undefined) return serialisedPattern();

		if (typeof this[key] === 'bigint')
			return serialisedPattern('bigint', serialiseBigInt(this[key]));

		if (this[key] instanceof Date)
			return serialisedPattern('date', serialiseDate(this[key]));

		if (this[key] instanceof RegExp)
			return serialisedPattern('regexp', serialiseRegExp(this[key]));

		if (this[key] instanceof Map)
			return serialisedPattern('map', serialiseMap(this[key]));

		if (this[key] instanceof Set)
			return serialisedPattern('set', serialiseSet(this[key]));

		if (key && typeof this === 'object' && _customReplacer) {
			return serialiseClass(
				this[key],
				_customReplacer,
				serialisedPattern
			);
		}
		return value;
	};
	function serialisedPattern(dataType, dataValue) {
		return `${customPrexif}|${dataType}|${dataValue}`;
	}
}

// Deserialisation
export function jsonReviver(customPrexif = DEFAULT_PREFIX, customReviver) {
	return function (_key, value) {
		if (`${customPrexif}|undefined|undefined` === value) return undefined;
		if (isPrimitive(value, customPrexif)) return value;
		{
			const { test, replace } = deserialisedPattern('bigint');
			if (test(value)) return deserialiseBigint(replace(value));
		}
		{
			const { test, replace } = deserialisedPattern('date');
			if (test(value)) return deserialiseDate(replace(value));
		}
		{
			const { test, replace } = deserialisedPattern('regexp');
			if (test(value)) return deserialiseRegExp(replace(value));
		}
		{
			const { test, replace } = deserialisedPattern('map');
			if (test(value)) return deserialiseMap(replace(value));
		}
		{
			const { test, replace } = deserialisedPattern('set');
			if (test(value)) return deserialiseSet(replace(value));
		}
		{
			const { test, replace } = deserialisedPattern('class');
			if (test(value))
				return deserialiseClass(replace(value), customReviver);
		}
		return value;
	};
	function deserialisedPattern(dataType, dataValue = '') {
		const pattern = new RegExp(
			`^${customPrexif}\\|${dataType}\\|${dataValue}`
		);
		return {
			test: val => pattern.test(val),
			replace: val => val.replace(pattern, ''),
		};
	}
}

function extractValue(dataValue) {
	return (
		extractAndCast(Boolean, 'boolean', dataValue) ||
		extractAndCast(Number, 'number', dataValue) ||
		extractAndCast(String, 'string', dataValue)
	);
}
function extractAndCast(typeClass, TypeName, dataValue) {
	const regExp = new RegExp(`^${TypeName}\\\|`);
	return regExp.test(dataValue)
		? typeClass(dataValue.replace(regExp, ''))
		: '';
}

function deserialiseBigint(value) {
	return BigInt(value);
}
function deserialiseDate(value) {
	return new Date(value);
}
function deserialiseRegExp(value) {
	const { source, flags } = JSON.parse(value);
	return new RegExp(source, flags);
}
function deserialiseMap(value) {
	const newMap = new Map();
	Object.entries(JSON.parse(value)).forEach(([key, val]) =>
		newMap.set(extractValue(key), val)
	);
	return newMap;
}
function deserialiseSet(value) {
	return new Set(JSON.parse(value));
}
function deserialiseClass(value, reviver) {
	const classPattern = /^(?<className>[^\|]*)\|(?<instance>.*)$/;
	const deserialised = value.match(classPattern);
	return reviver(deserialised?.groups);
}

function serialiseBigInt(_bigint) {
	return `${_bigint}`;
}
function serialiseDate(_date) {
	return _date.toISOString();
}
function serialiseRegExp(_regexp) {
	const { source, flags } = _regexp;
	return JSON.stringify({ source, flags });
}
function serialiseMap(_map) {
	const mapObj = {};
	_map.forEach((value, key) => (mapObj[`${typeof key}|${key}`] = value));
	return JSON.stringify(mapObj);
}
function serialiseSet(_set) {
	const setArr = [];
	_set.forEach(value => setArr.push(value));
	return JSON.stringify(setArr);
}
function serialiseClass(_class, _replacer, _serialisedPattern) {
	const serialisedCustom = _replacer(_class);
	if (serialisedCustom === undefined) return serialisedCustom;
	return serialisedCustom
		? _serialisedPattern('class', serialisedCustom)
		: _class;
}

function isPrimitive(value, customPrexif) {
	return (
		(value === null ||
			['boolean', 'number', 'string'].includes(typeof value)) &&
		!new RegExp(`^${customPrexif}|`).test(`${value}`)
	);
}
