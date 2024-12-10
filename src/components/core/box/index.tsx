import type { JSX } from 'solid-js/jsx-runtime';
import type { ValidComponent, ComponentProps, Component } from 'solid-js';
import
{
	splitProps,
	createMemo,
	createSignal,
	Show,
	onMount
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { Modifier } from '@/components'; // adjust as needed
import { ModifierProvider, useModifier } from '@/components'; // adjust as needed
import { InteractionManager } from './box-interaction-manager';

interface BoxOptions
{
	clickable?: {
		onClick?: ( e: MouseEvent ) => void;
	};
	pressable?: {
		onPressStart?: ( e: MouseEvent ) => JSX.CSSProperties | void;
		onPressEnd?: ( e: MouseEvent ) => void;
	};
	hoverable?: {
		onHoverStart?: ( e: MouseEvent ) => JSX.CSSProperties | void;
		onHoverEnd?: ( e: MouseEvent ) => void;
	};
	focusable?: {
		onFocus?: ( e: FocusEvent ) => JSX.CSSProperties | void;
		onBlur?: ( e: FocusEvent ) => void;
	};
	selectable?: {
		onSelect?: ( e: Event ) => JSX.CSSProperties | void;
		onDeselect?: ( e: Event ) => void;
	};

	draggable?: {
		data: string;
		onDragStart?: ( data: string, event: DragEvent ) => void;
		onDragEnd?: ( data: string, event: DragEvent ) => void;
	};

	droppable?: {
		onDrop?: ( data: string, event: DragEvent ) => void;
		onDragOver?: ( event: DragEvent ) => void;
	};

	snap?: { size: number; };
}



export type BoxProps<T extends ValidComponent> =
	& ComponentProps<T>
	& BoxOptions
	& {
		component?: T;
		modifier?: Modifier;
		style?: JSX.CSSProperties;
		x?: number;
		y?: number;
	};

export function Box<T extends ValidComponent = 'div'> ( props: BoxProps<T> )
{
	const [ local, others ] = splitProps( props, [
		'component',
		'modifier',
		'style',
		'clickable',
		'pressable',
		'focusable',
		'selectable',
		'hoverable',
		'draggable',
		'droppable',
		'snap',
		'x',
		'y'
	] );

	let elRef: HTMLElement | undefined;
	const [ posX, setPosX ] = createSignal( local[ 'x' ] ?? 0 );
	const [ posY, setPosY ] = createSignal( local[ 'y' ] ?? 0 );

	onMount( () =>
	{
		if ( elRef )
		{
			elRef.style.transform = `translate(${ posX() }px, ${ posY() }px)`;
		}
	} );

	const interactionManager = new InteractionManager( {
		clickable: local[ 'clickable' ],
		pressable: local[ 'pressable' ],
		focusable: local[ 'focusable' ],
		selectable: local[ 'selectable' ],
		hoverable: local[ 'hoverable' ],
		draggable: local[ 'draggable' ],
		droppable: local[ 'droppable' ],
		snap: local[ 'snap' ],
		getPosition: () => ( { x: posX(), y: posY() } ),
		setPosition: ( x, y ) =>
		{
			setPosX( x );
			setPosY( y );
			if ( elRef )
			{
				elRef.style.transform = `translate(${ x }px, ${ y }px)`;
			}
		},
		elRef: () => elRef
	} );

	function BoxContent ()
	{
		let baseStyle = () => ( {} );
		if ( local[ 'modifier' ] )
		{
			const { style: contextStyle } = useModifier();
			baseStyle = contextStyle;
		}

		const computedStyles = createMemo( () => ( {
			...baseStyle(),
			...( local[ 'style' ] || {} ),
			...( local[ 'clickable' ] || local[ 'pressable' ] ? { cursor: 'pointer' } : {} ),
			...interactionManager.getHoverStyle()[ 0 ](),
			...interactionManager.getFocusStyle()[ 0 ](),
			...interactionManager.getPressStyle()[ 0 ](),
			...interactionManager.getSelectStyle()[ 0 ](),
		} ) );

		const tabIndex = createMemo( () => ( local[ 'focusable' ] ? 0 : undefined ) );

		return (
			<Dynamic
				ref={ el => ( elRef = el as HTMLElement ) }
				component={ local[ 'component' ] || 'div' }
				style={ computedStyles() }
				tabIndex={ tabIndex() }
				{ ...interactionManager.getEventHandlers() }
				{ ...others }
			/>
		);
	}

	return (
		<Show when={ local[ 'modifier' ] } fallback={ <BoxContent /> }>
			<ModifierProvider modifier={ local[ 'modifier' ]! }>
				<BoxContent />
			</ModifierProvider>
		</Show>
	);
}
