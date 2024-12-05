import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Modifier, Alignment, Arrangement, mod } from '@/components/util/modifiers';

// Column
// -----------------------------------------------------------------------------------------------------------
export interface ColumnOptions
{
    alignment?: Modifier;
    arrangement?: Modifier;
}

export type ColumnProps<T extends ValidComponent> = BoxProps<T> & ColumnOptions;

export function Column<T extends ValidComponent = 'div'> ( props: ColumnProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ "modifier" ],
        [ "alignment", "arrangement", ]
    );

    const modifier = mod().display( "flex" ).flex( "column" )
        .then( properties[ 'modifier' ] )
        .then( options[ 'alignment' ] || Alignment.Center() )
        .then( options[ 'arrangement' ] || Arrangement.Start() );

    return <Box modifier={ modifier } { ...others } />;
}