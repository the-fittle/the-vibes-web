// refresh

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

export interface TagBoxOptions { }

export type TagBoxProps<T extends ValidComponent> = BoxProps<T> & TagBoxOptions

export function TagBox<T extends ValidComponent = 'div'> ( props: TagBoxProps<T> )
{
	const [ local, others ] = splitProps( props, [ 'as' ] )

	return (
		<div class={ cls( 'tag-box--root', css[ 'tag-box--root' ], 'relative flex flex-col w-full h-auto' ) }>

		</div>
	)
}
