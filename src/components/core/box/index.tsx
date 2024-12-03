import { Modifier, colors, mod } from '@/components/util'
import { type JSX, type ValidComponent, type ComponentProps, splitProps, createSignal, createEffect, createMemo } from 'solid-js'
import { type DynamicProps } from 'solid-js/web'

import { Dynamic } from 'solid-js/web'


// Box
// -----------------------------------------------------------------------------------------------------------
export interface BoxOptions<T extends ValidComponent>
{
	modifier?: Modifier
}

export type BoxProps<T extends ValidComponent> =
	{ component?: ( T | undefined ) }
	& ComponentProps<T>
	& BoxOptions<T>

export function Box<T extends ValidComponent = 'div'> ( props: BoxProps<T> )
{
	const [ local, others ] = splitProps( props, [ 'component', 'modifier' ] )

	const [ modifier, setModifier ] = createSignal(
		mod().then( local[ 'modifier' ] )
	)

	if ( local[ 'component' ] !== undefined )
	{
		console.log( 'Component:', local[ 'component' ] )

	}

	createMemo( () => setModifier( mod().then( local[ 'modifier' ] ) ) )

	return (
		<Dynamic
			component={ local[ 'component' ] || 'div' }
			style={ modifier().styles() } // Reactive modifier styles
			{ ...others }
		/>
	)
}