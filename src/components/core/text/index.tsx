import { JSX } from 'solid-js/jsx-runtime';
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';

// Text
// -----------------------------------------------------------------------------------------------------------
export interface TextOptions
{
    text: string;
    size?: number;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    family?: string;
    textAlign?: string;
    textDecoration?: string;
}

export type TextProps<T extends ValidComponent> = BoxProps<T> & TextOptions;

export function Text<T extends ValidComponent = 'div'> ( props: TextProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ 'style' ],
        [ 'text', 'size', 'family', 'weight', 'textAlign', 'textDecoration' ],
    );

    const defaultStyles: JSX.CSSProperties = {
        'font-size': options[ 'size' ],
        'font-family': options[ 'family' ],
        'font-weight': options[ 'weight' ],
        'text-align': options[ 'textAlign' ],
        'text-decoration': options[ 'textDecoration' ]
    };

    const combinedStyles = {
        ...defaultStyles,
        ...( properties[ 'style' ] || {} )
    };

    return <Box style={ combinedStyles } children={ options[ 'text' ] } { ...others } />;
}