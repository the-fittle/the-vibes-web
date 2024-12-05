import { ValidComponent, splitProps } from 'solid-js';
import { BoxProps, Box } from '../box';
import { Modifier } from '@/components/util/modifiers';

export interface TextBoxOptions
{
    type?: string;
    value?: string;
    onInput?: ( event: Event ) => void;
    placeholder?: string;
    disabled?: boolean;
    modifier?: Modifier;
}

export type TextBoxProps<T extends ValidComponent = 'input'> = BoxProps<T> & TextBoxOptions;

export function TextBox<T extends ValidComponent = 'input'> ( props: TextBoxProps<T> )
{
    const [ local, others ] = splitProps( props, [
        'modifier',
        'type',
        'value',
        'onInput',
        'placeholder',
        'disabled',
    ] );

    const modifier = new Modifier().then( local.modifier );

    return (
        <Box
            component="input"
            type={ local.type || 'text' }
            value={ local.value }
            onInput={ local.onInput }
            placeholder={ local.placeholder }
            disabled={ local.disabled }
            modifier={ modifier }
            { ...others }
        />
    );
}
