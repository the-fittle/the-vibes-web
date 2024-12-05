
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { mod } from '@/components/util/modifiers';

// Spacer
// -----------------------------------------------------------------------------------------------------------
export interface SpacerOptions
{ }

export type SpacerProps<T extends ValidComponent> = BoxProps<T> & SpacerOptions;

export function Spacer<T extends ValidComponent = 'div'> ( props: SpacerProps<T> )
{
    const [ properties, others ] = splitProps( props,
        [ "modifier", "children" ],
    );

    const modifier = mod()
        .then( properties[ 'modifier' ] );

    return <Box modifier={ modifier } { ...others } />;
}