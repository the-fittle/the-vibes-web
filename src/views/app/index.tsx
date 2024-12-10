import { JSX } from 'solid-js/jsx-runtime';
import { Box, Row, Column, Alignment, Arrangement, ColorShades, Color, mod } from '@/components';
import { Button } from '@/components/core/button';
import { Fontawesome, FontawesomeIcon } from '@/components/core/fontawesome';
import { Spacer, Text, TextBox } from '@/components';
import { createContext, useContext, createSignal, Accessor, Setter } from 'solid-js';
import { DragDropProvider } from '@/components/core/box/box-dnd-context';


// Context
// -----------------------------------------------------------------------------------------------------------
const AppContext = createContext<AppContext>();

export interface AppContext
{
    theme: [ Accessor<ColorShades>, Setter<ColorShades> ],
}

export function useAppContext ()
{
    const context = useContext( AppContext );
    if ( !context )
    {
        throw new Error( 'useAppContext must be used within an AppContext.Provider' );
    }
    return context;
}

// Root
// -----------------------------------------------------------------------------------------------------------
export function AppRoot ()
{
    return (
        <AppContext.Provider value={ {
            theme: createSignal<ColorShades>( Color.Slate )
        } }>
            <DragDropProvider>
                <AppContent />
            </DragDropProvider>
        </AppContext.Provider>
    );
}

// Content
// -----------------------------------------------------------------------------------------------------------
export function AppContent ()
{
    return (
        <Column
            modifier={
                mod()
                    .background( Color.Slate[ 400 ] )
                    .media( '(max-width: 768px)',
                        mod()
                            .background( Color.Red[ 500 ] )
                    )
            }
            alignment={ Alignment.Center() }
            arrangement={ Arrangement.Start() }>
            <Spacer weight={ 1 } />
            <Text text='Hello World' />
            <Spacer weight={ 1 } />

            {/* Example Draggable Box */ }
            <Box
                clickable={ { onClick: e => console.log( 'Box clicked!' ) } }
                pressable={ {
                    onPressStart: e => ( { border: '2px solid red' } ),
                    onPressEnd: e => console.log( 'Press ended' )
                } }
                hoverable={ {
                    onHoverStart: e => ( { background: 'lightblue' } ),
                    onHoverEnd: e => console.log( 'Hover ended' )
                } }
                focusable={ {
                    onFocus: e => ( { outline: '2px solid green' } ),
                    onBlur: e => console.log( 'Focus lost' )
                } }
                selectable={ {
                    onSelect: e => ( { color: 'purple' } ),
                    onDeselect: e => console.log( 'Deselected' )
                } }
                draggable={ {
                    data: 'my-draggable-item',
                    onDragStart: ( data, ev ) => console.log( 'Drag start', data ),
                    onDragEnd: ( data, ev ) => console.log( 'Drag end', data )
                } }
                x={ 10 }
                y={ 10 }
                style={ { width: '100px', height: '100px', background: 'gray', margin: '10px' } }
                onClick={ e => console.log( 'User click handler' ) }
            >
                Complex Box (Draggable)
            </Box>

            {/* Example Droppable Box */ }
            <Box
                droppable={ {
                    onDrop: ( data, ev ) => console.log( 'Dropped:', data ),
                    onDragOver: ev => console.log( 'Dragging over droppable area' )
                } }
                style={ { width: '200px', height: '200px', background: 'lightyellow', margin: '10px' } }
            >
                Drop Here (Droppable)
            </Box>

        </Column>
    );
}

// Component
// -----------------------------------------------------------------------------------------------------------
export const App = Object.assign( AppRoot, { Content: AppContent } );
