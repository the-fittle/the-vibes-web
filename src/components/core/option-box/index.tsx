// import
// {
// 	type ComponentProps,
// 	type ValidComponent,
// 	type Accessor,
// 	type Setter,
// 	splitProps,
// 	createSignal,
// 	createEffect,
// 	createMemo,
// 	createContext,
// 	useContext,
// 	onMount,
// 	onCleanup,
// } from 'solid-js';

// import
// {
// 	type FontawesomeIcon,
// 	type BoxRootProps,
// 	Fontawesome,
// 	Box,
// 	cls,
// 	createUUID
// } from '@/index';

// import css from './index.module.css';

// // Context
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxContext
// {
// 	getInputID?: Accessor<string | undefined>;
// 	setInputID?: Setter<string | undefined>;
// }

// export const OptionBoxContext = createContext<OptionBoxContext>();

// export function useOptionBoxContext ()
// {
// 	const context = useContext( OptionBoxContext );

// 	if ( !context )
// 	{
// 		throw new Error(
// 			'[carbon]: useOptionBoxContext must be used within a OptionBoxContext.Provider'
// 		);
// 	}

// 	return context;
// }

// // Root Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxRootOptions { }

// export type OptionBoxRootProps<T extends ValidComponent> = BoxRootProps<T> &
// 	OptionBoxRootOptions;

// export function OptionBoxRoot<T extends ValidComponent = 'div'> (
// 	props: OptionBoxRootProps<T>
// )
// {
// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	const [ getInputID, setInputID ] = createSignal<string | undefined>();

// 	return (
// 		<OptionBoxContext.Provider
// 			value={ {
// 				getInputID,
// 				setInputID,
// 			} }>
// 			<Box
// 				as={ local[ 'as' ] || 'div' }
// 				class={ cls(
// 					'option-box--root',
// 					css[ 'option-box--root' ]
// 					// getIsValid() === undefined
// 					// 	? undefined
// 					// 	: getIsValid()
// 					// 	? css['valid']
// 					// 	: css['invalid'],
// 					// getIsDisabled() ? css['disabled'] : undefined
// 				) }
// 				{ ...others }
// 			/>
// 		</OptionBoxContext.Provider>
// 	);
// }

// // Label Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxLabelOptions { }

// export type OptionBoxLabelProps<T extends ValidComponent> = BoxRootProps<T> &
// 	OptionBoxLabelOptions;

// export function OptionBoxLabel<T extends ValidComponent = 'label'> (
// 	props: OptionBoxLabelProps<T>
// )
// {
// 	var ref: any;

// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	const context = useOptionBoxContext();

// 	return (
// 		<Box
// 			as={ local[ 'as' ] || 'label' }
// 			ref={ ref }
// 			for={ context.getInputID && context.getInputID() }
// 			class={ cls( 'option-box--label', css[ 'option-box--label' ] ) }
// 			{ ...others }
// 		/>
// 	);
// }

// // Description Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxDescriptionOptions { }

// export type OptionBoxDescriptionProps<T extends ValidComponent> =
// 	BoxRootProps<T> & OptionBoxDescriptionOptions;

// export function OptionBoxDescription<T extends ValidComponent = 'div'> (
// 	props: OptionBoxDescriptionProps<T>
// )
// {
// 	var ref: any;

// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	return (
// 		<Box
// 			as={ local[ 'as' ] || 'div' }
// 			ref={ ref }
// 			class={ cls(
// 				'option-box--description',
// 				css[ 'option-box--description' ]
// 			) }
// 			{ ...others }
// 		/>
// 	);
// }

// // Input Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxInputOptions
// {
// 	pattern?: string | ( ( ref: HTMLInputElement ) => boolean );
// }

// export type OptionBoxInputProps<T extends ValidComponent> = BoxRootProps<T> &
// 	OptionBoxInputOptions &
// 	ComponentProps<T>;

// export function OptionBoxInput<T extends ValidComponent = 'input'> (
// 	props: OptionBoxInputProps<T>
// )
// {
// 	var ref: any;

// 	const context = useOptionBoxContext();

// 	const [ local, others ] = splitProps( props, [ 'as', 'class', 'id' ] );

// 	const id = createMemo( () => local[ 'id' ] || createUUID() );

// 	context.setInputID?.( id() );

// 	return (
// 		<Box
// 			as={ local[ 'as' ] || 'input' }
// 			id={ id() }
// 			ref={ ref }
// 			class={ cls( 'option-box--input', css[ 'option-box--input' ] ) }
// 			{ ...others }
// 		/>
// 	);
// }

// // OptionBoxIndicator Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxIndicatorOptions
// {
// 	icon?: FontawesomeIcon;
// }

// export type OptionBoxIndicatorProps<T extends ValidComponent> =
// 	BoxRootProps<T> & OptionBoxIndicatorOptions;

// export function OptionBoxIndicator<T extends ValidComponent = 'div'> (
// 	props: OptionBoxIndicatorProps<T>
// )
// {
// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	return (
// 		<Fontawesome
// 			icon={ local[ 'icon' ] || 'caret-down' }
// 			class={ cls( 'option-box--indicator', css[ 'option-box--indicator' ] ) }
// 		/>
// 	);
// }

// // OptionBoxModal Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxModalOptions { }

// export type OptionBoxModalProps<T extends ValidComponent> = BoxRootProps<T> &
// 	OptionBoxModalOptions;

// export function OptionBoxModal<T extends ValidComponent = 'ul'> (
// 	props: OptionBoxModalProps<T>
// )
// {
// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	return (
// 		<Box
// 			as={ local[ 'as' ] || 'ul' }
// 			class={ cls( 'option-box--modal', css[ 'option-box--modal' ] ) }
// 			{ ...others }
// 		/>
// 	);
// }

// // OptionBoxOption Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxOptionOptions { }

// export type OptionBoxOptionProps<T extends ValidComponent> = BoxRootProps<T> &
// 	OptionBoxOptionOptions;

// export function OptionBoxOption<T extends ValidComponent = 'li'> (
// 	props: OptionBoxOptionProps<T>
// )
// {
// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	return (
// 		<Box
// 			as={ local[ 'as' ] || 'li' }
// 			class={ cls( 'option-box--option', css[ 'option-box--option' ] ) }
// 			{ ...others }
// 		/>
// 	);
// }

// // OptionBox Component
// // -----------------------------------------------------------------------------------------------------------
// export interface OptionBoxOptions { }

// export type OptionBoxProps<T extends ValidComponent> = BoxRootProps<T> &
// 	OptionBoxOptions;

// export function OptionBox<T extends ValidComponent = 'div'> (
// 	props: OptionBoxProps<T>
// )
// {
// 	const [ local, others ] = splitProps( props, [ 'as' ] );

// 	return (
// 		<OptionBoxRoot>
// 			<OptionBoxLabel>Label</OptionBoxLabel>
// 			<div class="relative inline-full">
// 				<OptionBoxInput />
// 				<OptionBoxIndicator />
// 				<OptionBoxModal>
// 					<OptionBoxOption>Option 1</OptionBoxOption>
// 					<OptionBoxOption>Option 2</OptionBoxOption>
// 					<OptionBoxOption>Option 3</OptionBoxOption>
// 				</OptionBoxModal>
// 			</div>
// 			<OptionBoxDescription>Description</OptionBoxDescription>
// 		</OptionBoxRoot>
// 	);
// }
