import { createSignal } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export function cls(...classes: (string | undefined)[]): string {
	return classes.filter((c) => c).join(' ');
}

/**
 * Fixed Pixels (e.g., "16px")
 */
export type Fp = string;

/**
 * Scaled Pixels (e.g., "1rem")
 */
export type Sp = string;

/**
 * Convert a numeric value to Scaled Pixels (rem)
 *
 * @param value - The numeric value to convert.
 * @returns A string representing the value in rem units.
 */
export function sp(value: number): string {
	return `${value / 16}rem`; // Convert to rem for scalable units
}

/**
 * Convert a numeric value to Fixed Pixels (px)
 *
 * @param value - The numeric value to convert.
 * @returns A string representing the value in px units.
 */
export function fp(value: number): string {
	return `${value}px`; // Convert to px for fixed units
}

export class ModifierMedia {
	private _query: string;

	query(): string {
		return this._query;
	}

	private constructor(query: string) {
		this._query = query;
	}

	static Mobile = new ModifierMedia('(max-width: 600px)');
	static Tablet = new ModifierMedia('(max-width: 1024px)');
	static Desktop = new ModifierMedia('(min-width: 1025px)');
	static Light = new ModifierMedia('(prefers-color-scheme: light)');
	static Dark = new ModifierMedia('(prefers-color-scheme: dark)');

	static custom(query: string): ModifierMedia {
		return new ModifierMedia(query);
	}
}

export class ModifierMediaManager {
	private static instance: ModifierMediaManager;
	private queryStates: Map<string, () => boolean> = new Map();

	private constructor() {}

	private init(query: ModifierMedia): () => boolean {
		if (this.queryStates.has(query.query())) {
			return this.queryStates.get(query.query())!;
		}

		const [state, setState] = createSignal<boolean>(false);
		const mql = window.matchMedia(query.query());

		setState(mql.matches);

		const handler = (e: MediaQueryListEvent) => setState(e.matches);

		if (mql.addEventListener) {
			mql.addEventListener('change', handler);
		} else {
			mql.addListener(handler);
		}

		this.queryStates.set(query.query(), state);
		return state;
	}

	public static getInstance(): ModifierMediaManager {
		if (!ModifierMediaManager.instance) {
			ModifierMediaManager.instance = new ModifierMediaManager();
		}
		return ModifierMediaManager.instance;
	}

	public isActive(query: ModifierMedia): () => boolean {
		return this.init(query);
	}
}

export class Modifier {
	private _style: JSX.CSSProperties = {};
	private _conditionalModifiers: Map<ModifierMedia, Modifier> = new Map();

	style(): JSX.CSSProperties {
		return this._style;
	}

	conditionalModifiers(): Map<ModifierMedia, Modifier> {
		return this._conditionalModifiers;
	}

	css<K extends keyof JSX.CSSProperties>(
		property: K,
		value?: JSX.CSSProperties[K]
	): Modifier {
		if (value === undefined) return this;

		const newModifier = new Modifier();
		newModifier._style = { ...this._style, [property]: value };
		newModifier._conditionalModifiers = new Map(this._conditionalModifiers);
		return newModifier;
	}

	then(modifier?: Modifier): Modifier {
		if (!modifier) return this;
		const combined = new Modifier();
		combined._style = { ...this._style, ...modifier._style };
		combined._conditionalModifiers = new Map(this._conditionalModifiers);
		modifier._conditionalModifiers.forEach((mod, query) => {
			combined._conditionalModifiers.set(query, mod);
		});
		return combined;
	}

	when(query: ModifierMedia, modifier?: Modifier): Modifier {
		if (!modifier) return this;
		const newModifier = new Modifier();
		newModifier._style = { ...this._style };
		newModifier._conditionalModifiers = new Map(this._conditionalModifiers);
		newModifier._conditionalModifiers.set(query, modifier);
		return newModifier;
	}

	// Utilities
	// -------------------------------------------------------------------------------------------------------
	// Display
	// -----------------------------------------------------------------------------------------------------------
	display = (display: JSX.CSSProperties['display']): Modifier =>
		this.css('display', display);

	fontSize = (size: JSX.CSSProperties['font-size']): Modifier =>
		this.css('font-size', size);

	fontWeight = (weight: JSX.CSSProperties['font-weight']): Modifier =>
		this.css('font-weight', weight);

	fontFamily = (family: JSX.CSSProperties['font-family']): Modifier =>
		this.css('font-family', family);

	textAlign = (align: JSX.CSSProperties['text-align']): Modifier =>
		this.css('text-align', align);

	textDecoration = (
		decoration: JSX.CSSProperties['text-decoration']
	): Modifier => this.css('text-decoration', decoration);

	// Theme
	// -----------------------------------------------------------------------------------------------------------
	background = (color: JSX.CSSProperties['background']): Modifier =>
		this.css('background', color);

	color = (color: JSX.CSSProperties['color']): Modifier =>
		this.css('color', color);

	// Opacity
	// -----------------------------------------------------------------------------------------------------------
	opacity = (opacity: JSX.CSSProperties['opacity']): Modifier =>
		this.css('opacity', opacity);

	// Layout
	// -----------------------------------------------------------------------------------------------------------
	box = (sizing: JSX.CSSProperties['box-sizing']): Modifier =>
		this.css('box-sizing', sizing);

	centerHorizontalFlex = (): Modifier =>
		this.css('margin-left', 'auto').css('margin-right', 'auto');

	centerVerticalFlex = (): Modifier =>
		this.css('margin-top', 'auto').css('margin-bottom', 'auto');

	centerFlex = (): Modifier =>
		this.centerHorizontalFlex().centerVerticalFlex();

	centerHorizontalAbsolute = (): Modifier =>
		this.css('left', '50%').css('transform', 'translateX(-50%)');

	centerVerticalAbsolute = (): Modifier =>
		this.css('top', '50%').css('transform', 'translateY(-50%)');

	centerAbsolute = (): Modifier =>
		this.centerHorizontalAbsolute().centerVerticalAbsolute();

	margin(value: JSX.CSSProperties['margin']): Modifier;
	margin(
		values: Partial<{
			top: JSX.CSSProperties['top'];
			right: JSX.CSSProperties['right'];
			bottom: JSX.CSSProperties['bottom'];
			left: JSX.CSSProperties['left'];
		}>
	): Modifier;
	margin(
		...args:
			| [JSX.CSSProperties['margin']]
			| [
					Partial<{
						top: JSX.CSSProperties['right'];
						right: JSX.CSSProperties['bottom'];
						bottom: JSX.CSSProperties['left'];
						left: JSX.CSSProperties['top'];
					}>
			  ]
	): Modifier {
		if (args.length === 1) {
			const [value] = args;
			if (typeof value === 'string') {
				return this.css('margin', value);
			} else {
				throw new Error(
					'Invalid argument: expected a string for single argument.'
				);
			}
		} else if (args.length === 1 && typeof args[0] === 'object') {
			const values = args[0] as Partial<{
				top: string;
				right: string;
				bottom: string;
				left: string;
			}>;

			if (!values)
				throw new Error(
					'Invalid argument: object values cannot be undefined.'
				);

			if (values.top) this.marginTop(values.top);

			if (values.right) this.marginRight(values.right);

			if (values.bottom) this.marginBottom(values.bottom);

			if (values.left) this.marginLeft(values.left);

			return this;
		}

		throw new Error('Invalid arguments provided to margin');
	}

	marginLeft = (value: JSX.CSSProperties['margin-left']): Modifier =>
		this.css('margin-left', value);

	marginRight = (value: JSX.CSSProperties['margin-right']): Modifier =>
		this.css('margin-right', value);

	marginTop = (value: JSX.CSSProperties['margin-top']): Modifier =>
		this.css('margin-top', value);

	marginBottom = (value: JSX.CSSProperties['margin-bottom']): Modifier =>
		this.css('margin-bottom', value);

	padding(value: JSX.CSSProperties['padding']): Modifier;
	padding(
		values: Partial<{
			top: JSX.CSSProperties['top'];
			right: JSX.CSSProperties['right'];
			bottom: JSX.CSSProperties['bottom'];
			left: JSX.CSSProperties['left'];
		}>
	): Modifier;
	padding(
		...args:
			| [JSX.CSSProperties['padding']]
			| [
					Partial<{
						top: JSX.CSSProperties['right'];
						right: JSX.CSSProperties['bottom'];
						bottom: JSX.CSSProperties['left'];
						left: JSX.CSSProperties['top'];
					}>
			  ]
	): Modifier {
		if (args.length === 1) {
			const [value] = args;
			if (typeof value === 'string') {
				return this.css('padding', value);
			} else {
				throw new Error(
					'Invalid argument: expected a string for single argument.'
				);
			}
		} else if (args.length === 1 && typeof args[0] === 'object') {
			const values = args[0] as Partial<{
				top: string;
				right: string;
				bottom: string;
				left: string;
			}>;

			if (!values)
				throw new Error(
					'Invalid argument: object values cannot be undefined.'
				);

			if (values.top) this.paddingTop(values.top);

			if (values.right) this.paddingRight(values.right);

			if (values.bottom) this.paddingBottom(values.bottom);

			if (values.left) this.paddingLeft(values.left);

			return this;
		}

		throw new Error('Invalid arguments provided to padding');
	}

	paddingLeft = (value: JSX.CSSProperties['padding-left']): Modifier =>
		this.css('padding-left', value);

	paddingRight = (value: JSX.CSSProperties['padding-right']): Modifier =>
		this.css('padding-right', value);

	paddingTop = (value: JSX.CSSProperties['padding-top']): Modifier =>
		this.css('padding-top', value);

	paddingBottom = (value: JSX.CSSProperties['padding-bottom']): Modifier =>
		this.css('padding-bottom', value);

	position = (position: JSX.CSSProperties['position']): Modifier =>
		this.css('position', position);

	width = (value: JSX.CSSProperties['width']): Modifier =>
		this.css('width', value);

	height = (value: JSX.CSSProperties['height']): Modifier =>
		this.css('height', value);

	static widthIn(minmax: number): Modifier;
	static widthIn(min: number, max: number): Modifier;
	static widthIn(...args: [number] | [number, number]): Modifier {
		const [first, second] = args;

		if (args.length === 1) {
			return new Modifier().css('width', `${first}px`);
		} else if (args.length === 2) {
			return new Modifier()
				.css('min-width', `${first}px`)
				.css('max-width', `${second}px`);
		}

		throw new Error('Invalid arguments provided to widthIn');
	}

	static heightIn(minmax: number): Modifier;
	static heightIn(min: number, max: number): Modifier;
	static heightIn(...args: [number] | [number, number]): Modifier {
		const [first, second] = args;

		if (args.length === 1) {
			return new Modifier().css('height', `${first}px`);
		} else if (args.length === 2) {
			return new Modifier()
				.css('min-height', `${first}px`)
				.css('max-height', `${second}px`);
		}

		throw new Error('Invalid arguments provided to heightIn');
	}

	top = (value: JSX.CSSProperties['top']): Modifier => this.css('top', value);

	right = (value: JSX.CSSProperties['right']): Modifier =>
		this.css('right', value);

	bottom = (value: JSX.CSSProperties['bottom']): Modifier =>
		this.css('bottom', value);

	left = (value: JSX.CSSProperties['left']): Modifier =>
		this.css('left', value);

	fillMaxWidth = (): Modifier => this.css('width', '100%');

	fillMaxHeight = (): Modifier => this.css('height', '100%');

	fillMaxSize = (): Modifier => this.fillMaxWidth().fillMaxHeight();

	fillParent = (): Modifier => this.position('absolute').fillMaxSize();

	fillViewport = (): Modifier => this.position('fixed').fillMaxSize();

	// Flex
	// -----------------------------------------------------------------------------------------------------------
	flex(value: JSX.CSSProperties['flex-direction']): Modifier {
		return this.display('flex').css('flex-direction', value);
	}

	weight(value: number): Modifier {
		return this.css('flex', `${value} 1 auto`);
	}

	// Others
	// -----------------------------------------------------------------------------------------------------------
	border(value: JSX.CSSProperties['border']): Modifier;
	border(
		value: JSX.CSSProperties['border'],
		color: JSX.CSSProperties['border-color']
	): Modifier;
	border(
		value: JSX.CSSProperties['border'],
		color: JSX.CSSProperties['border-color'],
		radius: JSX.CSSProperties['border-radius']
	): Modifier;
	border(
		value: JSX.CSSProperties['border'],
		color: JSX.CSSProperties['border-color'],
		radius: JSX.CSSProperties['border-radius'],
		width: JSX.CSSProperties['border-width']
	): Modifier;
	border(
		value: JSX.CSSProperties['border'],
		color?: JSX.CSSProperties['border-color'],
		radius?: JSX.CSSProperties['border-radius'],
		width?: JSX.CSSProperties['border-width']
	): Modifier {
		if (color) this.borderColor(color);

		if (width) this.borderWidth(width);

		return this.css('border', value);
	}

	borderColor = (color: JSX.CSSProperties['border-color']): Modifier =>
		this.css('border-color', color);

	borderWidth = (width: JSX.CSSProperties['border-width']): Modifier =>
		this.css('border-width', width);

	outline(value: JSX.CSSProperties['outline']): Modifier;
	outline(
		value: JSX.CSSProperties['outline'],
		color: JSX.CSSProperties['outline-color']
	): Modifier;
	outline(
		value: JSX.CSSProperties['outline'],
		color: JSX.CSSProperties['outline-color'],
		width: JSX.CSSProperties['outline-width']
	): Modifier;
	outline(
		value: JSX.CSSProperties['outline'],
		color?: JSX.CSSProperties['outline-color'],
		width?: JSX.CSSProperties['outline-width']
	): Modifier {
		if (color) this.outlineColor(color);

		if (width) this.outlineWidth(width);

		return this.css('outline', value);
	}

	outlineColor = (color: JSX.CSSProperties['outline-color']): Modifier =>
		this.css('outline-color', color);

	outlineWidth = (width: JSX.CSSProperties['outline-width']): Modifier =>
		this.css('outline-width', width);

	radius = (radius: JSX.CSSProperties['border-radius']): Modifier =>
		this.css('border-radius', radius);

	// Shadow Utilities
	// -----------------------------------------------------------------------------------------------------------
	shadow(value: string): Modifier {
		return this.css('box-shadow', value);
	}

	elevation = (z: number, color: string = 'rgba(0, 0, 0, 0.118)'): Modifier =>
		this.css(
			'box-shadow',
			createShadowBlur('0px', `${z}px`, `${z * 2}px`, color)
		);

	// Others
	// -----------------------------------------------------------------------------------------------------------
	animate = (animation: JSX.CSSProperties['animation']): Modifier =>
		this.css('animation', animation);

	transition = (transition: JSX.CSSProperties['transition']): Modifier =>
		this.css('transition', transition);

	cursor = (cursor: JSX.CSSProperties['cursor']): Modifier =>
		this.css('cursor', cursor);

	events = (events: JSX.CSSProperties['pointer-events']): Modifier =>
		this.css('pointer-events', events);

	select = (select: JSX.CSSProperties['user-select']): Modifier =>
		this.css('user-select', select);

	filter = (filter: JSX.CSSProperties['filter']): Modifier =>
		this.css('filter', filter);
}

export function mod(): Modifier {
	return new Modifier();
}

export function createShadowBlur(
	x: string,
	y: string,
	blur: string,
	color: string
): string {
	return `${x} ${y} ${blur} ${color}`;
}

export function createShadowSpread(
	x: string,
	y: string,
	blur: string,
	spread: string,
	color: string
): string {
	return `${x} ${y} ${blur} ${spread} ${color}`;
}

export class Typography extends Modifier {
	static custom = (
		fontSize?: string,
		fontFamily?: string,
		fontWeight?: string,
		textAlign?: string,
		textDecoration?: string
	): Typography => mod();
	// .fontSize(fontSize)
	// .fontFamily(fontFamily)
	// .fontWeight(fontWeight)
	// .textAlign(textAlign)
}

// Alignment
// -----------------------------------------------------------------------------------------------------------
export class Alignment extends Modifier {
	static Center = (): Alignment => mod().css('place-items', 'center');

	static Start = (): Alignment => mod().css('place-items', 'start');

	static End = (): Alignment => mod().css('place-items', 'end');

	static Stretch = (): Alignment => mod().css('place-items', 'stretch');

	static Baseline = (): Alignment => mod().css('place-items', 'baseline');
}

// Arrangement
// -----------------------------------------------------------------------------------------------------------
export class Arrangement extends Modifier {
	static Center = (): Arrangement => mod().css('place-content', 'center');

	static Start = (): Arrangement => mod().css('place-content', 'start');

	static End = (): Arrangement => mod().css('place-content', 'end');

	static SpacedBetween = (): Arrangement =>
		mod().css('place-content', 'space-between');

	static SpacedAround = (): Arrangement =>
		mod().css('place-content', 'space-around');

	static SpacedEvenly = (): Arrangement =>
		mod().css('place-content', 'space-evenly');

	static SpacedBy = (value: Fp | Sp): Arrangement => mod().css('gap', value);
}

// Shape
// -----------------------------------------------------------------------------------------------------------
export class Shape extends Modifier {
	static Circle = (): Shape => mod().css('border-radius', '50%');

	static Rounded = (radius: string = '8px'): Shape =>
		mod().css('border-radius', radius);

	static Squircle = (roundness: number = 0.5): Shape => {
		const clampedRoundness = Math.max(0, Math.min(roundness, 1));
		const n = 2 + (1 - clampedRoundness) * 8;

		const superellipsePoint = (t: number) => {
			const cosT = Math.cos(t);
			const sinT = Math.sin(t);
			return {
				x: Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n),
				y: Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n),
			};
		};

		const points: string[] = [];
		const steps = 64;
		for (let i = 0; i <= steps; i++) {
			const t = (Math.PI * 2 * i) / steps;
			const { x, y } = superellipsePoint(t);
			points.push(`${(x + 1) / 2},${(y + 1) / 2}`);
		}

		const squirclePath = `M ${points[0]} ${points
			.slice(1)
			.map((p) => `L ${p}`)
			.join(' ')} Z`;

		const svgNamespace = 'http://www.w3.org/2000/svg';
		const clipPathId = `shapes-squircle-${clampedRoundness.toFixed(2)}`;

		if (!document.getElementById(clipPathId)) {
			const svg =
				document.querySelector('svg defs') ||
				(() => {
					const svg = document.createElementNS(svgNamespace, 'svg');
					svg.setAttribute('width', '0');
					svg.setAttribute('height', '0');
					const defs = document.createElementNS(svgNamespace, 'defs');
					svg.appendChild(defs);
					document.body.appendChild(svg);
					return defs;
				})();

			const clipPath = document.createElementNS(svgNamespace, 'clipPath');
			clipPath.setAttribute('id', clipPathId);
			clipPath.setAttribute('clipPathUnits', 'objectBoundingBox');

			const path = document.createElementNS(svgNamespace, 'path');
			path.setAttribute('d', squirclePath);

			clipPath.appendChild(path);

			svg.appendChild(clipPath);
		}

		return mod().css('clip-path', `url(#${clipPathId})`);
	};
}

// Filter
// -----------------------------------------------------------------------------------------------------------
export class Filter extends Modifier {
	static Blur = (radius: string): Filter =>
		mod().css('filter', `blur(${radius})`);

	static Brightness = (value: number): Filter =>
		mod().css('filter', `brightness(${value})`);

	static Contrast = (value: number): Filter =>
		mod().css('filter', `contrast(${value})`);

	static Grayscale = (value: number): Filter =>
		mod().css('filter', `grayscale(${value})`);

	static Sepia = (value: number): Filter =>
		mod().css('filter', `sepia(${value})`);

	static BlurShadow = (string: string): Filter =>
		mod().css('filter', `drop-shadow(${string})`);
}
