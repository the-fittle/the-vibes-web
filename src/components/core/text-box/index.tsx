import { JSX } from 'solid-js/jsx-runtime';
import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';

export interface TextBoxOptions
{
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onInput?: ( event: Event ) => void;
}

export type TextBoxProps<T extends ValidComponent = 'input'> = BoxProps<T> & TextBoxOptions;

export function TextBox<T extends ValidComponent = 'input'> ( props: TextBoxProps<T> )
{
    const [ properties, options, others ] = splitProps( props,
        [ 'style' ],
        [ 'modifier', 'value', 'placeholder', 'disabled', 'onInput' ],
    );

    const defaultStyles: JSX.CSSProperties = {};

    const combinedStyles = {
        ...defaultStyles,
        ...( properties[ 'style' ] || {} )
    };

    return (
        <Box
            component='input'
            type='text'
            value={ options[ 'value' ] }
            placeholder={ options[ 'placeholder' ] }
            disabled={ options[ 'disabled' ] }
            onInput={ options[ 'onInput' ] }
            { ...others }
        />
    );
}
