import { Box, ColorShades, ColorPalette, colors, mod, ModifierMedia, Alignment, Arrangement, Column, createShadowBlur, fp, Row, sp } from '@/components'
import { Button } from '@/components/core/button'
import { Fontawesome, FontawesomeIcon } from '@/components/core/fontawesome'
import { Spacer, Text, TextBox } from '@/components'
import { createContext, useContext, createSignal, Accessor, Setter } from 'solid-js'
import { SignUp } from '../authentication/signUp'

// Context
// -----------------------------------------------------------------------------------------------------------
const AppContext = createContext<AppContext>()

export interface AppContext
{
    theme: Accessor<ColorShades>
    setTheme: Setter<ColorShades>
}

export function useAppContext ()
{
    const context = useContext( AppContext )

    if ( !context )
    {
        throw new Error( 'useAppContext must be used within an AppContext.Provider' )
    }

    return context
}

// Root
// -----------------------------------------------------------------------------------------------------------
export function AppRoot ()
{
    const [ theme, setTheme ] = createSignal<ColorShades>( colors.slate )

    return (
        <AppContext.Provider value={ {
            theme,
            setTheme,
        } }>
            <AppContent />
        </AppContext.Provider>
    )
}

// Content
// -----------------------------------------------------------------------------------------------------------
export function AppContent ()
{
    return (
        <SignUp />
    )
}

// Component
// -----------------------------------------------------------------------------------------------------------
export const App = Object.assign( AppRoot, { Content: AppContent } )
