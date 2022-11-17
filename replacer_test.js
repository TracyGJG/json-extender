const testObject = [
	{ alpha: new Date(), beta: 42, gamma: 'test', delta: [] },
	new Date(),
];

function replacer(key, val) {
	console.log(
		`KEY: ${key}, VAL:${val}, Is Date:${this[key] instanceof Date}`
	);
	if (this[key] instanceof Date) return `DATE_${this[key].toISOString()}`;
	return val;
}

console.log(JSON.stringify(testObject, replacer));
