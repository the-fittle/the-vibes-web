import { JSX } from 'solid-js/jsx-runtime';
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';

export interface ButtonOptions
{
    disabled?: boolean;
    onClick?: ( e: InputEvent ) => void;
}

export type ButtonProps<T extends ValidComponent = 'button'> = BoxProps<T> & ButtonOptions;

export function Button<T extends ValidComponent = 'button'> ( props: ButtonProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ 'style' ],
        [ 'onClick', 'disabled' ],
    );

    const defaultStyles: JSX.CSSProperties = {};

    const combinedStyles = {
        ...defaultStyles,
        ...( properties[ 'style' ] || {} )
    };

    return (
        <Box
            as="button"
            clickable={ options[ 'onClick' ] }
            disabled={ options.disabled }
            { ...others }
        />
    );
}
