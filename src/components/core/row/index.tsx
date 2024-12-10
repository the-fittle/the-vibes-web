import { JSX } from 'solid-js/jsx-runtime';
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Alignment, Arrangement } from '../util';


// Row
// -----------------------------------------------------------------------------------------------------------
export interface RowOptions
{
    alignment?: Alignment;
    arrangement?: Arrangement;
}

export type RowProps<T extends ValidComponent> = BoxProps<T> & RowOptions;

export function Row<T extends ValidComponent = 'div'> ( props: RowProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ 'style' ],
        [ "alignment", "arrangement" ] );

    const defaultStyles: JSX.CSSProperties = {
        'display': 'flex',
        'flex-direction': 'row'
    };
    const alignmentStyles = options.alignment?.styles() || Alignment.Center().styles();
    const arrangementStyles = options.arrangement?.styles() || Arrangement.Start().styles();

    const combinedStyles = {
        ...defaultStyles,
        ...alignmentStyles,
        ...arrangementStyles,
        ...( properties[ 'style' ] || {} ),
    };

    return <Box style={ combinedStyles } { ...others } />;
}
