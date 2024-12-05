import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Modifier, Alignment, Arrangement, mod } from '@/components/util/modifiers';

// Row
// -----------------------------------------------------------------------------------------------------------
export interface RowOptions
{
    alignment?: Modifier;
    arrangement?: Modifier;
}

export type RowProps<T extends ValidComponent> = BoxProps<T> & RowOptions;

export function Row<T extends ValidComponent = 'div'> ( props: RowProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ "modifier" ],
        [ "alignment", "arrangement", ]
    );

    const modifier = mod().display( "flex" ).flex( "row" )
        .then( properties[ 'modifier' ] )
        .then( options[ 'alignment' ] || Alignment.Center() )
        .then( options[ 'arrangement' ] || Arrangement.Start() );

    return <Box modifier={ modifier } { ...others } />;
}