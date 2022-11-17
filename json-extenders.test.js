import { jsonReplacer, jsonReviver } from './json-extenders';

const serialisedObject = [
	{
		alpha: undefined,
		beta: null,
		gamma: true,
	},
	{
		delta: 42,
		epsilon: 'forty-two',
		zeta: [],
	},
	{
		eta: {},
		theta: 42n,
		iota: new Date('2134-05-06T07:08:09.000Z'),
	},
];
const deserialisedString = `[
  {
    "alpha": "JS_TEST|undefined|undefined",
    "beta": null,
    "gamma": true
  },
  {
    "delta": 42,
    "epsilon": "forty-two",
    "zeta": []
  },
  {
    "eta": {},
    "theta": "JS_TEST|bigint|42",
    "iota": "JS_TEST|date|2134-05-06T07:08:09.000Z"
  }
]`;

describe('JSON Extenders', () => {
	describe('JSON Replacer', () => {
		test('Serialisation', () => {
			const result = JSON.stringify(
				serialisedObject,
				jsonReplacer('JS_TEST'),
				2
			);
			expect(result).toBe(deserialisedString);
		});
	});

	describe('JSON Reviver', () => {
		test('Deserialisation', () => {
			const result = JSON.parse(
				deserialisedString,
				jsonReviver('JS_TEST')
			);
			expect(result).toEqual(serialisedObject);
		});
	});
});
