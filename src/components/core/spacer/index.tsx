import { JSX } from 'solid-js/jsx-runtime';
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Alignment, Arrangement } from '../util';


// Spacer
// -----------------------------------------------------------------------------------------------------------
export interface SpacerOptions
{
    weight?: number;
}

export type SpacerProps<T extends ValidComponent> = BoxProps<T, SpacerOptions>;

export function Spacer<T extends ValidComponent = 'div'> ( props: SpacerProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [],
        [ 'weight' ],
    );

    const defaultStyles: JSX.CSSProperties = {
        'flex': `${ options[ 'weight' ] } 1 100%`
    };
    const combinedStyles = { ...defaultStyles };

    return <Box style={ combinedStyles } { ...others } />;
}
