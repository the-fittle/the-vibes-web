import { createContext, useContext, createSignal, Accessor } from 'solid-js';

type DragDropState = {
    currentDraggedItem: Accessor<string | null>;
    setCurrentDraggedItem: ( item: string | null ) => void;
};

const DragDropContext = createContext<DragDropState>();

export function DragDropProvider ( props: { children: any; } )
{
    const [ currentDraggedItem, setCurrentDraggedItem ] = createSignal<string | null>( null );

    return (
        <DragDropContext.Provider value={ { currentDraggedItem, setCurrentDraggedItem } }>
            { props.children }
        </DragDropContext.Provider>
    );
}

export function useDragDropContext ()
{
    const ctx = useContext( DragDropContext );
    if ( !ctx )
    {
        throw new Error( "useDragDropContext must be used within DragDropProvider" );
    }
    return ctx;
}
