const DEFAULT_PREFIX = 'JSON_EXTENSION';

function isStandardType(value) {
	let type = +(value === null);

	type += +(
		!type && [('boolean', 'number', 'string')].includes(typeof value)
	);
	type += +(!type && value instanceof Array) * 2;
	type += +(!type && value instanceof Date) * 3;
	return type;
}

// Serialisation
export function jsonReplacer(customPrexif = DEFAULT_PREFIX, customReplacer) {
	const serialise = (type, value) => `${customPrexif}|${type}|${value}`;

	return function (key, value) {
		if (value === undefined) return serialise(undefined, value);
		return value;
	};
}

// Deserialisation
export function jsonReviver(customPrexif = DEFAULT_PREFIX, customReviver) {
	const deserialisePattern = `^${customPrexif}|(?<type>[^|]+)|(?<value>[^|]+)$`;
	const deserialiseRegExp = new RegExp(deserialisePattern);
	const deserialise = serialisedValue => {
		return { type, value };
	};

	return deserialise;
}
