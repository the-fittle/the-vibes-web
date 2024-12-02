import { defineConfig } from '@unocss/runtime';
import { Theme } from '@unocss/preset-uno';
import presetUno from '@unocss/preset-uno';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig( {
	content: {
		filesystem: [ '**/*.{html,js,ts,jsx,tsx,css,scss}' ],
	},
	rules: [],
	shortcuts: [
		[ /^l-(.*)$/, ( [ , c ] ) => `left-${ c }` ],
		[ /^r-(.*)$/, ( [ , c ] ) => `right-${ c }` ],
		[ /^t-(.*)$/, ( [ , c ] ) => `top-${ c }` ],
		[ /^b-(.*)$/, ( [ , c ] ) => `bottom-${ c }` ],
		[ /^x-(.*)$/, ( [ , c ] ) => `translate-x-${ c }` ],
		[ /^y-(.*)$/, ( [ , c ] ) => `translate-y-${ c }` ],
		[ /^g-(.*)$/, ( [ , c ] ) => `gap-${ c }` ],
		[ /^background-(.*)$/, ( [ , c ] ) => `bg-${ c }` ],
		[ /^inset$/, () => 'inset-0' ],

	],
	transformers: [ transformerVariantGroup() ],
	presets: [ presetUno() ],
} );