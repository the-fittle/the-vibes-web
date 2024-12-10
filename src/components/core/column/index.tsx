import { JSX } from 'solid-js/jsx-runtime';
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Alignment, Arrangement } from '../util';


// Column
// -----------------------------------------------------------------------------------------------------------
export interface ColumnOptions
{
    alignment?: Alignment;
    arrangement?: Arrangement;
}

export type ColumnProps<T extends ValidComponent> = BoxProps<T> & ColumnOptions;

export function Column<T extends ValidComponent = 'div'> ( props: ColumnProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ 'style' ],
        [ "alignment", "arrangement" ] );

    const defaultStyles: JSX.CSSProperties = {
        'display': 'flex',
        'flex-direction': 'column'
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
