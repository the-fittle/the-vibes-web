import
{
	type ComponentProps,
	type ValidComponent,
	type Accessor,
	type Setter,
	splitProps,
	createSignal,
	createEffect,
	createMemo,
	createContext,
	useContext,
	onMount,
	onCleanup,
} from 'solid-js'

import { type BoxProps, Box, cls, createUuid } from '@/index'

import css from './index.module.css'

// Context
// -----------------------------------------------------------------------------------------------------------
export interface TextBoxContext
{
	getInputID?: Accessor<string | undefined>
	setInputID?: Setter<string | undefined>
	getValue?: Accessor<string | undefined>
	setValue?: Setter<string | undefined>
}

export const TextBoxContext = createContext<TextBoxContext>()

export function useTextBoxContext ()
{
	const context = useContext( TextBoxContext )

	if ( !context )
	{
		throw new Error(
			'[carbon]: useTextBoxContext must be used within a TextBoxContext.Provider'
		)
	}

	return context
}

// Root Component
// -----------------------------------------------------------------------------------------------------------
export interface TextBoxRootOptions { }

export type TextBoxRootProps<T extends ValidComponent> = BoxProps<T> &
	TextBoxRootOptions

export function TextBoxRoot<T extends ValidComponent = 'div'> (
	props: TextBoxRootProps<T>
)
{
	const [ local, others ] = splitProps( props, [ 'as' ] )

	return (
		<TextBoxContext.Provider value={ {} }>
			<Box
				as={ local[ 'as' ] || 'div' }
				class={ cls( 'text-box--root', css[ 'text-box--root' ] ) }
				{ ...others }
			/>
		</TextBoxContext.Provider>
	)
}

// Label Component
// -----------------------------------------------------------------------------------------------------------
export interface TextBoxLabelOptions { }

export type TextBoxLabelProps<T extends ValidComponent> = BoxProps<T> &
	TextBoxLabelOptions

export function TextBoxLabel<T extends ValidComponent = 'label'> (
	props: TextBoxLabelProps<T>
)
{
	var ref: any

	const [ local, others ] = splitProps( props, [ 'as' ] )

	const context = useTextBoxContext()

	const [ getInputID, setInputID ] = createSignal<string | undefined>(
		undefined
	)

	createEffect( () =>
	{
		setInputID( context.getInputID && context.getInputID() )
	} )

	return (
		<Box
			as={ local[ 'as' ] || 'label' }
			ref={ ref }
			for={ getInputID() }
			class={ cls( 'text-box--label', css[ 'text-box--label' ] ) }
			{ ...others }
		/>
	)
}

// Description Component
// -----------------------------------------------------------------------------------------------------------
export interface TextBoxDescriptionOptions { }

export type TextBoxDescriptionProps<T extends ValidComponent> =
	BoxProps<T> & TextBoxDescriptionOptions

export function TextBoxDescription<T extends ValidComponent = 'div'> (
	props: TextBoxDescriptionProps<T>
)
{
	var ref: any

	const [ local, others ] = splitProps( props, [ 'as' ] )

	return (
		<Box
			as={ local[ 'as' ] || 'div' }
			ref={ ref }
			class={ cls( 'text-box--description', css[ 'text-box--description' ] ) }
			{ ...others }
		/>
	)
}

// Input Component
// -----------------------------------------------------------------------------------------------------------
export interface TextBoxInputOptions { }

export type TextBoxInputProps<T extends ValidComponent> = BoxProps<T> &
	TextBoxInputOptions &
	ComponentProps<T>

export function TextBoxInput<T extends ValidComponent = 'input'> (
	props: TextBoxInputProps<T>
)
{
	var ref: any

	const context = useTextBoxContext()

	const [ local, others ] = splitProps( props, [
		'as',
		'id',
		'ref',
		'class',
		'value',
	] );

	[ context.getInputID, context.setInputID ] = createSignal<string | undefined>(
		local[ 'id' ] || createUuid()
	);
	[ context.getValue, context.setValue ] = createSignal<string | undefined>(
		local[ 'value' ] || ''
	)

	return (
		<Box
			as={ local[ 'as' ] || 'input' }
			id={ ( context.getInputID && context.getInputID() ) || undefined }
			ref={ ref }
			class={ cls( 'text-box--input', css[ 'text-box--input' ] ) }
			value={ ( context.getValue && context.getValue() ) || undefined }
			{ ...others }
		/>
	)
}

// TextBox Component
// -----------------------------------------------------------------------------------------------------------
export interface TextBoxOptions
{
	value?: string
	label?: string
	description?: string
}

export type TextBoxProps<T extends ValidComponent> = TextBoxRootProps<T> &
	TextBoxOptions

export function TextBox<T extends ValidComponent = 'div'> (
	props: TextBoxProps<T>
)
{
	const [ local, others ] = splitProps( props, [
		'as',
		'value',
		'label',
		'description',
	] )

	return (
		<TextBoxRoot>
			<TextBoxLabel>{ local[ 'label' ] }</TextBoxLabel>
			<div class="inline-full">
				<TextBoxInput value={ local[ 'value' ] } />
			</div>
			<TextBoxDescription>{ local[ 'description' ] }</TextBoxDescription>
		</TextBoxRoot>
	)
}
