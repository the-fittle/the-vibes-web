import type { JSX, ValidComponent, ComponentProps } from 'solid-js'
import { createContext, useContext, onMount, onCleanup, createEffect, createSignal } from 'solid-js'
import { SetStoreFunction, createStore } from 'solid-js/store'
import { Box, Row, Column, Spacer, Text, Fontawesome, FontawesomeIcon, colors } from '@/components'
import { Alignment, Arrangement, fp, mod, sp } from '@/components/util/modifiers'

import css from './index.module.css'

// Context
// -----------------------------------------------------------------------------------------------------------
const AppContext =
	createContext<AppContext>()

export interface AppContext { }

export function useAppContext ()
{
	const context = useContext( AppContext )

	function demo ( alignment: Alignment ): void
	{
		console.log( alignment.styles() )
	}

	function test ()
	{
		demo( Alignment.Center() )
		demo( Alignment.Start() )
		demo( Alignment.End() )
		demo( Alignment.Stretch() )
		demo( Alignment.Baseline() )
	}

	test()

	if ( !context )
	{
		throw new Error(
			'useAppContext must be used within an AppContext.Provider'
		)
	}

	return context
}

// Root
// -----------------------------------------------------------------------------------------------------------
export function AppRoot ()
{
	const [ appContext, setAppContext ] = createStore<AppContext>( {} )

	return (
		<AppContext.Provider value={ [ appContext, setAppContext ] }>
			<AppContent />
		</AppContext.Provider>
	)
}

// Content
// -----------------------------------------------------------------------------------------------------------
export function AppContent ()
{
	const context = useAppContext()

	return (
		<Box
			modifier={ mod()
				.background( colors.slate[ 50 ] )
				.fillMaxSize() }
		>
			<Column
				modifier={ mod()
					.padding( sp( 16 ) )
					.fillMaxSize() }
				alignment={ Alignment.Center() }
				arrangement={ Arrangement.SpacedBetween() }
			>
				<Spacer modifier={ mod().weight( 1 ) } />

				<Text
					text="Hello, Vibes!"
					modifier={ mod()
						.typography( {
							size: fp( 32 ),
							weight: 800,
							family: 'Montserrat',
							color: colors.slate[ 600 ],
						} )
					}
				/>

				<Spacer modifier={ mod().weight( 1 ) } />

				<Column
					modifier={ mod()
						.padding( sp( 16 ) )
						.fillMaxWidth() }
					alignment={ Alignment.Center() }
					arrangement={ Arrangement.SpacedBy( sp( 16 ) ) }
				>
					<Row
						modifier={ mod()
							.fillMaxWidth()
							.padding( sp( 16 ) )
							.background( colors.slate[ 100 ] )
							.radius( fp( 8 ) )
						}
						alignment={ Alignment.Center() }
						arrangement={ Arrangement.SpacedBy( sp( 8 ) ) }
					>
						<Text
							text={ `made with` }
							modifier={ mod()
								.typography( {
									size: fp( 14 ),
									weight: 400,
									family: 'Montserrat',
									color: colors.slate[ 400 ],
								} )
							}
						/>
						<Fontawesome
							icon={ FontawesomeIcon.Heart }
							size={ fp( 14 ) }
							color={ colors.slate[ 400 ] }
						/>
						<Text
							text={ `by the.fittle` }
							modifier={ mod()
								.typography( {
									size: fp( 14 ),
									weight: 400,
									family: 'Montserrat',
									color: colors.slate[ 400 ],
								} )
							}
						/>
					</Row>
				</Column>
			</Column>
		</Box>
	)
}



// Component
// -----------------------------------------------------------------------------------------------------------
export const App = Object.assign( AppRoot, { Content: AppContent } );

