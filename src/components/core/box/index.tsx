import { createSignal, ValidComponent, ComponentProps, splitProps, createMemo } from 'solid-js';
import { Modifier, ModifierMediaManager } from '@/components';
import { JSX } from 'solid-js/jsx-runtime';
import { Dynamic } from 'solid-js/web';


// Options
// -----------------------------------------------------------------------------------------------------------
export interface BoxOptions<T extends ValidComponent>
{
	modifier?: Modifier;
}

export type BoxProps<T extends ValidComponent> = {
	component?: T | undefined;
} & ComponentProps<T> &
	BoxOptions<T>;

export function Box<T extends ValidComponent = 'div'> ( props: BoxProps<T> )
{
	const [ local, others ] = splitProps( props, [ 'component', 'modifier' ] );

	const mediaManager = ModifierMediaManager.getInstance();

	const computedStyles = createMemo<JSX.CSSProperties>( () =>
	{
		let combinedStyles: JSX.CSSProperties = { ...local.modifier?.style() };

		if ( local.modifier )
		{
			local.modifier.conditionalModifiers().forEach( ( condModifier, query ) =>
			{
				const isActive = mediaManager.isActive( query )();
				if ( isActive )
				{
					combinedStyles = { ...combinedStyles, ...condModifier.style() };
				}
			} );
		}

		return combinedStyles;
	} );

	return (
		<Dynamic
			component={ local.component || 'div' }
			style={ computedStyles() }
			{ ...others }
		/>
	);
}
