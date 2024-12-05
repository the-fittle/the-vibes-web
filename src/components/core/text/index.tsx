import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Modifier, Alignment, Arrangement, mod } from '@/components/util/modifiers';

// Text
// -----------------------------------------------------------------------------------------------------------
export interface TextOptions
{
    text: string;
    size?: number;
    weight?: number;
    family?: string;
    color?: string;
}

export type TextProps<T extends ValidComponent> = BoxProps<T> & TextOptions;

export function Text<T extends ValidComponent = 'div'> ( props: TextProps<T> )
{
    let [ properties, options, others ] = splitProps( props,
        [ "modifier" ],
        [ "text", "size", "family", "weight", "color", ]
    );

    const modifier = mod()
        .then( properties[ 'modifier' ] );
    // .thenIf( options[ 'size' ], mod().fontSize( options[ 'size' ] ) )
    // .thenIf( options[ 'weight' ], mod().fontWeight( options[ 'weight' ] ) )
    // .thenIf( options[ 'family' ], mod().fontFamily( options[ 'family' ] ) )
    // .thenIf( options[ 'color' ], mod().color( options[ 'color' ] ) )

    return <Box modifier={ modifier } children={ options[ 'text' ] } { ...others } />;
}