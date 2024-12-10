import { createContext, useContext, Accessor, createMemo } from 'solid-js';
import { Modifier } from '../../util/modifier';
import { JSX } from 'solid-js/jsx-runtime';

interface ModifierContextValue
{
	modifier: Modifier;
	style: Accessor<JSX.CSSProperties>; // Use JSX.CSSProperties here
}

const ModifierContext = createContext<ModifierContextValue>();

export function ModifierProvider ( props: { modifier?: Modifier; children: any; } )
{
	const modifier = props.modifier || new Modifier();

	// `modifier.style()` returns JSX.CSSProperties
	const style = createMemo( () => modifier.style() );

	return (
		<ModifierContext.Provider value={ { modifier, style } }>
			{ props.children }
		</ModifierContext.Provider>
	);
}

export function useModifier ()
{
	const context = useContext( ModifierContext );
	if ( !context )
	{
		throw new Error( "useModifier must be used within a ModifierProvider" );
	}
	return context;
}
