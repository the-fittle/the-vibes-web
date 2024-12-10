import { createSignal, onCleanup } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export class Unit {
	constructor(private _value: number, private _unit: string) {}
	value(): string {
		return `${this._value}${this._unit}`;
	}
}

export const px = (value: number) => new Unit(value, 'px');
export const rem = (value: number) => new Unit(value, 'rem');
export const per = (value: number) => new Unit(value, '%');

const mediaQuerySignals: Map<string, () => boolean> = new Map();

function getMediaQueryState(query: string): () => boolean {
	if (mediaQuerySignals.has(query)) {
		return mediaQuerySignals.get(query)!;
	}

	const [state, setState] = createSignal<boolean>(false);
	const mql = window.matchMedia(query);

	const updateState = (e: MediaQueryListEvent | MediaQueryList) => {
		setState(e.matches);
	};

	updateState(mql);

	if (mql.addEventListener) {
		mql.addEventListener('change', updateState);
	} else {
		mql.addListener(updateState);
	}

	onCleanup(() => {
		if (mql.removeEventListener) {
			mql.removeEventListener('change', updateState);
		} else {
			mql.removeListener(updateState);
		}
	});

	mediaQuerySignals.set(query, state);
	return state;
}

export class ConditionalModifier {
	constructor(private condition: unknown, public style: JSX.CSSProperties) {}
	isActive(): boolean {
		if (typeof this.condition === 'boolean') {
			return this.condition;
		}
		return false;
	}
}

export class MediaModifier {
	private state: () => boolean;
	public style: JSX.CSSProperties;

	constructor(query: string, style: JSX.CSSProperties) {
		this.state = getMediaQueryState(query);
		this.style = style;
	}

	isActive(): boolean {
		return this.state();
	}
}

export class Modifier {
	private _style: JSX.CSSProperties = {};
	private _conditionalModifiers: ConditionalModifier[] = [];
	private _mediaModifiers: MediaModifier[] = [];

	style(): JSX.CSSProperties {
		let combinedStyles = { ...this._style };

		for (const condMod of this._conditionalModifiers) {
			if (condMod.isActive()) {
				combinedStyles = { ...combinedStyles, ...condMod.style };
			}
		}

		for (const mediaMod of this._mediaModifiers) {
			if (mediaMod.isActive()) {
				combinedStyles = { ...combinedStyles, ...mediaMod.style };
			}
		}

		return combinedStyles;
	}

	/**
	 * Utility method to handle either Modifier or JSX.CSSProperties.
	 */
	private resolveStyles(
		styles: JSX.CSSProperties | Modifier
	): JSX.CSSProperties {
		return styles instanceof Modifier ? styles.style() : styles;
	}

	css(styles: JSX.CSSProperties | Modifier): this {
		const finalStyles = this.resolveStyles(styles);
		this._style = { ...this._style, ...finalStyles };
		return this;
	}

	conditional(
		condition: unknown,
		styles: JSX.CSSProperties | Modifier
	): this {
		const finalStyles = this.resolveStyles(styles);
		this._conditionalModifiers.push(
			new ConditionalModifier(condition, finalStyles)
		);
		return this;
	}

	media(query: string, styles: JSX.CSSProperties | Modifier): this {
		const finalStyles = this.resolveStyles(styles);
		this._mediaModifiers.push(new MediaModifier(query, finalStyles));
		return this;
	}

	background(color: string): this {
		this._style.background = color;
		return this;
	}

	color(color: string): this {
		this._style.color = color;
		return this;
	}
}

export function mod(): Modifier {
	return new Modifier();
}
