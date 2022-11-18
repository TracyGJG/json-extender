const testMap = new Map();
testMap.set('alpha', 'beta');
testMap.set(42, 'gamma');
testMap.set(true, 'delta');

const testSet = new Set(['alpha']);
testSet.add(42).add(true);

const testObject = [
	{ alpha: new Date(), beta: 42, gamma: 'test', delta: [] },
	new Date(),
	testMap,
	testSet,
];

function replacer(key, val) {
	function serialiseMap(_map) {
		const mapObj = {};
		_map.forEach(
			(key, value) => (mapObj[`${typeof value}|${key}`] = value)
		);
		return JSON.stringify(mapObj);
	}
	function serialiseSet(_set) {
		const setArr = [];
		_set.forEach(value => setArr.push(value));
		return JSON.stringify(setArr);
	}
	console.log(
		`KEY: ${key}, VAL:${val}, Is Date:${this[key] instanceof Date}`
	);
	if (this[key] instanceof Date) return `DATE_${this[key].toISOString()}`;
	if (this[key] instanceof Map) return `MAP_${serialiseMap(this[key])}`;
	if (this[key] instanceof Set) return `SET_${serialiseSet(this[key])}`;
	return val;
}

console.log(JSON.stringify(testObject, replacer));
