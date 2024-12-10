export class Alignment {
	constructor(private _styles: Record<string, string>) {}

	static Center = (): Alignment => new Alignment({ 'place-items': 'center' });
	static Start = (): Alignment => new Alignment({ 'place-items': 'start' });
	static End = (): Alignment => new Alignment({ 'place-items': 'end' });

	styles(): Record<string, string> {
		return this._styles;
	}
}

export class Arrangement {
	constructor(private _styles: Record<string, string>) {}

	static Center = (): Arrangement =>
		new Arrangement({ 'place-content': 'center' });
	static Start = (): Arrangement =>
		new Arrangement({ 'place-content': 'flex-start' });
	static End = (): Arrangement =>
		new Arrangement({ 'place-content': 'flex-end' });
	static SpacedBetween = (): Arrangement =>
		new Arrangement({ 'place-content': 'space-between' });
	static SpacedAround = (): Arrangement =>
		new Arrangement({ 'place-content': 'space-around' });
	static SpacedEvenly = (): Arrangement =>
		new Arrangement({ 'place-content': 'space-evenly' });
	static SpacedBy = (value: string): Arrangement =>
		new Arrangement({ gap: value });

	styles(): Record<string, string> {
		return this._styles;
	}
}
