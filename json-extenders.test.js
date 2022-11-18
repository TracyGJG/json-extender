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
testMap.set('alpha', 'beta');
testMap.set(42, 'gamma');
testMap.set(true, 'delta');

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
    "delta": "JS_TEST|map|{\\\"string\|alpha\\\":\\\"string\|beta\\\",\\\"number|42\\\":\\\"string\|gamma\\\",\\\"boolean|true\\\":\\\"string\|delta\\\"}",
    "epsilon": "JS_TEST|set|[\\\"alpha\\\",42,true]"
  }
]`;

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
});
