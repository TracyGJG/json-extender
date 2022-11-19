import { jsonReplacer, jsonReviver } from './json-extenders';

const standardObject = [
	{
		alpha: null,
		beta: true,
		gamma: 42,
	},
	{
		delta: 'forty-two',
		epsilon: [],
		zeta: {},
	},
];
const standardString = `[
  {
    "alpha": null,
    "beta": true,
    "gamma": 42
  },
  {
    "delta": "forty-two",
    "epsilon": [],
    "zeta": {}
  }
]`;

const testMap = new Map();
testMap.set('alpha', true);
testMap.set(42, 'gamma');
testMap.set(true, 42);

const testSet = new Set(['alpha']);
testSet.add(42).add(true);

const extendedObject = [
	{
		alpha: undefined,
		beta: 42n,
		gamma: new Date('2134-05-06T07:08:09.000Z'),
	},
	{
		delta: testMap,
		epsilon: testSet,
	},
];
const extendedString = `[
  {
    "alpha": "JS_TEST|undefined|undefined",
    "beta": "JS_TEST|bigint|42",
    "gamma": "JS_TEST|date|2134-05-06T07:08:09.000Z"
  },
  {
    "delta": "JS_TEST|map|{\\\"string\|alpha\\\":true,\\\"number|42\\\":\\\"gamma\\\",\\\"boolean|true\\\":42}",
    "epsilon": "JS_TEST|set|[\\\"alpha\\\",42,true]"
  }
]`;

class ParentObject {
	constructor(msg) {
		this.msg = msg;
	}
}

class CustomObject extends ParentObject {
	constructor(msg1, msg2) {
		super('base');
		this.msg1 = msg1;
		this.msg2 = msg2;
	}
}
const testParentObj = new ParentObject('The answer');
const testCustomObj1 = new CustomObject('Hello World', "Don't Panic");
const customObject1 = [
	{
		alpha: testCustomObj1,
		beta: testParentObj,
	},
];
const customString = `[
  {
    "alpha": "JS_TEST|class|CustomObject|{\\\"msg\\\":\\\"base\\\",\\\"msg1\\\":\\\"Hello World\\\"}"
  }
]`;
const testCustomObj2 = new CustomObject('Hello World');
const customObject2 = [
	{
		alpha: testCustomObj2,
	},
];

function customReplacer(val) {
	if (val.constructor === ParentObject) return undefined;
	if (val.constructor === CustomObject)
		return serialiseCustom(val, 'CustomObject', ['msg', 'msg1']);
	return false;

	function serialiseCustom(instance, className, properties) {
		const newObj = Object.entries(instance).reduce((newObj, [key, val]) => {
			return properties.includes(key)
				? { ...newObj, [key]: val }
				: newObj;
		}, {});
		const newStr = `${className}|${JSON.stringify(newObj)}`;
		return newStr;
	}
}

function customReviver(customValue) {
	if (customValue?.className && customValue?.instance) {
		if (customValue.className === 'CustomObject') {
			const properties = JSON.parse(customValue.instance);
			const newInstance = new CustomObject(properties.msg1);
			newInstance.msg = properties.msg;
			return newInstance;
		}
	}
}

describe('JSON Extenders', () => {
	describe('Standard properties', () => {
		describe('JSON Replacer', () => {
			test('Serialisation', () => {
				const result = JSON.stringify(
					standardObject,
					jsonReplacer('JS_TEST'),
					2
				);
				expect(result).toBe(standardString);
			});
		});

		describe('JSON Reviver', () => {
			test('Deserialisation', () => {
				const result = JSON.parse(
					standardString,
					jsonReviver('JS_TEST')
				);
				expect(result).toEqual(standardObject);
			});
		});
	});
	describe('Extended properties', () => {
		describe('JSON Replacer', () => {
			test('Serialisation', () => {
				const result = JSON.stringify(
					extendedObject,
					jsonReplacer('JS_TEST'),
					2
				);
				expect(result).toBe(extendedString);
			});
		});

		describe('JSON Reviver', () => {
			test('Deserialisation', () => {
				const result = JSON.parse(
					extendedString,
					jsonReviver('JS_TEST')
				);
				expect(result).toEqual(extendedObject);
			});
		});
	});
	describe('Custom properties', () => {
		describe('JSON Replacer', () => {
			test('Serialisation', () => {
				const result = JSON.stringify(
					customObject1,
					jsonReplacer('JS_TEST', customReplacer),
					2
				);
				expect(result).toBe(customString);
			});
		});

		describe('JSON Reviver', () => {
			test('Deserialisation', () => {
				const result = JSON.parse(
					customString,
					jsonReviver('JS_TEST', customReviver)
				);
				expect(result).toEqual(customObject2);
			});
		});
	});
});
