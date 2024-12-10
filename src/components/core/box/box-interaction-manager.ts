import { createSignal } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { useDragDropContext } from './box-dnd-context';

interface ClickableOptions {
	onClick?: (e: MouseEvent) => void;
}

interface PressableOptions {
	onPressStart?: (e: MouseEvent) => JSX.CSSProperties | void;
	onPressEnd?: (e: MouseEvent) => void; // optional end callback if needed
}

interface HoverableOptions {
	onHoverStart?: (e: MouseEvent) => JSX.CSSProperties | void;
	onHoverEnd?: (e: MouseEvent) => void;
}

interface FocusableOptions {
	onFocus?: (e: FocusEvent) => JSX.CSSProperties | void;
	onBlur?: (e: FocusEvent) => void;
}

interface SelectableOptions {
	onSelect?: (e: Event) => JSX.CSSProperties | void;
	onDeselect?: (e: Event) => void;
}

interface DraggableOptions {
	data: string;
	onDragStart?: (data: string, event: DragEvent) => void;
	onDragEnd?: (data: string, event: DragEvent) => void;
}

interface DroppableOptions {
	onDrop?: (data: string, event: DragEvent) => void;
	onDragOver?: (event: DragEvent) => void;
}

export class InteractionManager {
	private hoverStyle = createSignal<JSX.CSSProperties>({});
	private focusStyle = createSignal<JSX.CSSProperties>({});
	private pressStyle = createSignal<JSX.CSSProperties>({});
	private selectStyle = createSignal<JSX.CSSProperties>({});

	constructor(
		private options: {
			clickable?: ClickableOptions;
			pressable?: PressableOptions;
			hoverable?: HoverableOptions;
			focusable?: FocusableOptions;
			selectable?: SelectableOptions;
			draggable?: DraggableOptions;
			droppable?: DroppableOptions;

			// User-defined event handlers
			onClick?: (e: MouseEvent) => void;
			onMouseDown?: (e: MouseEvent) => void;
			onMouseUp?: (e: MouseEvent) => void;
			onMouseEnter?: (e: MouseEvent) => void;
			onMouseLeave?: (e: MouseEvent) => void;
			onFocus?: (e: FocusEvent) => void;
			onBlur?: (e: FocusEvent) => void;
			onSelect?: (e: Event) => void;
			onDeselect?: (e: Event) => void;

			snap?: { size: number };
			getPosition: () => { x: number; y: number };
			setPosition: (x: number, y: number) => void;
			elRef: () => HTMLElement | undefined;
		}
	) {
		// Runtime check: cannot be both draggable and droppable
		if (this.options.draggable && this.options.droppable) {
			throw new Error(
				'A component cannot be both draggable and droppable.'
			);
		}
	}

	getHoverStyle() {
		return this.hoverStyle;
	}
	getFocusStyle() {
		return this.focusStyle;
	}
	getPressStyle() {
		return this.pressStyle;
	}
	getSelectStyle() {
		return this.selectStyle;
	}

	private snap(x: number, y: number): [number, number] {
		if (!this.options.snap) return [x, y];
		const { size } = this.options.snap;
		const snappedX = Math.round(x / size) * size;
		const snappedY = Math.round(y / size) * size;
		return [snappedX, snappedY];
	}

	getEventHandlers(): JSX.HTMLAttributes<any> {
		const {
			clickable,
			pressable,
			hoverable,
			focusable,
			selectable,
			draggable,
			droppable,
			onClick,
			onMouseDown,
			onMouseUp,
			onMouseEnter,
			onMouseLeave,
			onFocus,
			onBlur,
			onSelect,
			onDeselect,
			getPosition,
			setPosition,
			elRef,
		} = this.options;

		const dnd = useDragDropContext();

		const eventHandlers: JSX.HTMLAttributes<any> = {
			// Clickable -> onClick
			onClick: (e: MouseEvent) => {
				clickable?.onClick?.(e);
				onClick?.(e);
			},

			// Pressable -> onMouseDown & onMouseUp
			onMouseDown: (e: MouseEvent) => {
				if (pressable?.onPressStart) {
					const styles = pressable.onPressStart(e);
					if (styles) this.pressStyle[1](styles);
				}
				onMouseDown?.(e);
			},
			onMouseUp: (e: MouseEvent) => {
				if (pressable) {
					this.pressStyle[1]({});
					pressable.onPressEnd?.(e);
				}
				onMouseUp?.(e);
			},

			// Hoverable -> onMouseEnter & onMouseLeave
			onMouseEnter: (e: MouseEvent) => {
				if (hoverable?.onHoverStart) {
					const styles = hoverable.onHoverStart(e);
					if (styles) this.hoverStyle[1](styles);
				}
				onMouseEnter?.(e);
			},
			onMouseLeave: (e: MouseEvent) => {
				if (hoverable) {
					this.hoverStyle[1]({});
					hoverable.onHoverEnd?.(e);
				}
				onMouseLeave?.(e);
			},

			// Focusable -> onFocus & onBlur
			onFocus: (e: FocusEvent) => {
				if (focusable?.onFocus) {
					const styles = focusable.onFocus(e);
					if (styles) this.focusStyle[1](styles);
				}
				onFocus?.(e);
			},
			onBlur: (e: FocusEvent) => {
				if (focusable) {
					this.focusStyle[1]({});
					focusable.onBlur?.(e);
				}
				onBlur?.(e);
			},

			// Selectable -> onSelect & onDeselect
			onSelect: (e: Event) => {
				if (selectable?.onSelect) {
					const styles = selectable.onSelect(e);
					if (styles) this.selectStyle[1](styles);
				}
				onSelect?.(e);
			},
		};

		if (draggable) {
			Object.assign(eventHandlers, {
				draggable: true,
				onDragStart: (e: DragEvent) => {
					e.dataTransfer?.setData('text/plain', draggable.data);
					dnd.setCurrentDraggedItem(draggable.data);
					draggable.onDragStart?.(draggable.data, e);
				},
				onDragEnd: (e: DragEvent) => {
					if (this.options.snap && elRef()) {
						const { x, y } = getPosition();
						const [snappedX, snappedY] = this.snap(x, y);
						setPosition(snappedX, snappedY);
						const el = elRef();
						if (el) {
							el.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
						}
					}
					dnd.setCurrentDraggedItem(null);
					draggable.onDragEnd?.(draggable.data, e);
				},
			});
		}

		if (droppable) {
			Object.assign(eventHandlers, {
				onDragOver: (e: DragEvent) => {
					e.preventDefault();
					droppable.onDragOver?.(e);
				},
				onDrop: (e: DragEvent) => {
					e.preventDefault();
					const data = e.dataTransfer?.getData('text/plain') || '';
					droppable.onDrop?.(data, e);
					dnd.setCurrentDraggedItem(null);
				},
			});
		}

		return eventHandlers;
	}
}
