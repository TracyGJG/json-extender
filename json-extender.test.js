import { jsonReplacer, jsonReviver } from './json-extender';

const standardObject = [
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
const standardString = `[
  {
    "alpha": "undefined_undefined",
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
    "theta": "bigint_42",
    "iota": "date_2134-05-06T07:08:09.000Z"
  }
]`;

describe('JSON Extender', () => {
	describe('JSON Replacer', () => {
		test('Serialisation', () => {
			expect(
				JSON.stringify(
					standardObject,
					function (key, value) {
						if (value === undefined) return `undefined_undefined`;
						if (typeof this[key] === 'bigint')
							return `bigint_${value}`;
						if (this[key] instanceof Date)
							return `date_${this[key].toISOString()}`;
						return value;
					},
					2
				)
			).toBe(standardString);
		});
	});

	describe('JSON Reviver', () => {
		test('Deserialisation', () => {
			expect(
				JSON.parse(standardString, (key, value) => {
					if ('undefined_undefined' === value) return undefined;
					if (/^bigint_/.test(value))
						return BigInt(value.replace(/^bigint_/, ''));
					if (/^date_/.test(value))
						return new Date(value.replace(/^date_/, ''));
					return value;
				})
			).toEqual(standardObject);
		});
	});
});
