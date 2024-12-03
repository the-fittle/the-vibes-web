import { ValidComponent, splitProps } from 'solid-js'
import { BoxProps, Box } from '../box'
import { Modifier } from '@/components/util/modifiers'

export interface ButtonOptions
{
    onClick?: ( event: Event ) => void
    disabled?: boolean
    modifier?: Modifier
    children?: any
}

export type ButtonProps<T extends ValidComponent = 'button'> = BoxProps<T> & ButtonOptions

export function Button<T extends ValidComponent = 'button'> ( props: ButtonProps<T> )
{
    const [ local, others ] = splitProps( props, [ 'modifier', 'onClick', 'disabled', 'children' ] )

    const modifier = new Modifier().then( local.modifier )

    return (
        <Box
            as="button"
            onClick={ local.onClick }
            disabled={ local.disabled }
            modifier={ modifier }
            { ...others }
        >
            { local.children }
        </Box>
    )
}
