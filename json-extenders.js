const DEFAULT_PREFIX = 'JSON_EXTENSION';

// Serialisation
export function jsonReplacer(customPrexif = DEFAULT_PREFIX, customReplacer) {
	return function (key, value) {
		if (value === undefined) return serialisedPattern();

		if (typeof this[key] === 'bigint')
			return serialisedPattern('bigint', value);

		if (this[key] instanceof Date)
			return serialisedPattern('date', this[key].toISOString());

		if (this[key] instanceof Map)
			return serialisedPattern('map', serialiseMap(this[key]));

		if (this[key] instanceof Set)
			return serialisedPattern('set', serialiseSet(this[key]));

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

		const bigIntRegExp = deserialisedPattern('bigint');
		if (bigIntRegExp.test(value))
			return BigInt(value.replace(bigIntRegExp, ''));

		const dateRegExp = deserialisedPattern('date');
		if (dateRegExp.test(value))
			return new Date(value.replace(dateRegExp, ''));

		const mapRegExp = deserialisedPattern('map');
		if (mapRegExp.test(value)) {
			const newMap = new Map();
			Object.entries(JSON.parse(value.replace(mapRegExp, ''))).forEach(
				([key, val]) => newMap.set(extractValue(key), extractValue(val))
			);
			return newMap;
		}
		const setRegExp = deserialisedPattern('set');
		if (setRegExp.test(value))
			return new Set(JSON.parse(value.replace(setRegExp, '')));

		return value;
	};
	function deserialisedPattern(dataType, dataValue = '') {
		return new RegExp(`^${customPrexif}\\|${dataType}\\|${dataValue}`);
	}
}

function extractValue(dataValue) {
	return (
		extractCast(Boolean, 'boolean', dataValue) ||
		extractCast(Number, 'number', dataValue) ||
		extractCast(String, 'string', dataValue)
	);
}
function extractCast(typeClass, TypeName, dataValue) {
	const regExp = new RegExp(`^${TypeName}\\\|`);
	return regExp.test(dataValue)
		? typeClass(dataValue.replace(regExp, ''))
		: '';
}
function serialiseMap(_map) {
	const mapObj = {};
	_map.forEach(
		(value, key) =>
			(mapObj[`${typeof key}|${key}`] = `${typeof value}|${value}`)
	);
	return JSON.stringify(mapObj);
}
function serialiseSet(_set) {
	const setArr = [];
	_set.forEach(value => setArr.push(value));
	return JSON.stringify(setArr);
}
