const DEFAULT_PREFIX = 'JSON_EXTENSION';

// Serialisation
export function jsonReplacer(customPrexif = DEFAULT_PREFIX, customReplacer) {
	const serialisedPattern = (dataType, dataValue) =>
		`${customPrexif}|${dataType}|${dataValue}`;
	return function (key, value) {
		if (value === undefined) return serialisedPattern();
		if (typeof this[key] === 'bigint')
			return serialisedPattern('bigint', value);
		if (this[key] instanceof Date)
			return serialisedPattern('date', this[key].toISOString());
		return value;
	};
}

// Deserialisation
export function jsonReviver(customPrexif = DEFAULT_PREFIX, customReviver) {
	const deserialisedPattern = (dataType, dataValue = '') =>
		new RegExp(`^${customPrexif}\\\|${dataType}\\\|${dataValue}`);
	return function (_key, value) {
		if (`${customPrexif}|undefined|undefined` === value) return undefined;
		const bigIntRegExp = deserialisedPattern('bigint');
		if (bigIntRegExp.test(value))
			return BigInt(value.replace(bigIntRegExp, ''));
		const dateRegExp = deserialisedPattern('date');
		if (dateRegExp.test(value))
			return new Date(value.replace(dateRegExp, ''));
		return value;
	};
}
