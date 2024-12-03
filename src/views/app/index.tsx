import { createContext, useContext, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Box, Row, Column, Spacer, Text, Fontawesome, FontawesomeIcon, Button, TextBox } from '@/components'
import { Alignment, Arrangement, fp, sp, mod, colors, createShadowBlur } from '@/components/util'

// Context
// -----------------------------------------------------------------------------------------------------------
const AppContext = createContext<AppContext>()

export interface AppContext { }

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
	// console.clear()

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
	const [ email, setEmail ] = createSignal( '' )
	const [ message, setMessage ] = createSignal( '' )
	const [ loading, setLoading ] = createSignal( false )

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

				<Box
					modifier={ mod()
						.width( '18%' )
						.padding( sp( 32 ) )
						.background( colors.white )
						.shadow( createShadowBlur( fp( 0 ), fp( 0 ), fp( 16 ), colors.slate[ 200 ], ) )
						.radius( fp( 8 ) ) }>
					<Text
						text="Hello, Vibes!"
						modifier={ mod().typography( {
							size: fp( 24 ),
							weight: 800,
							family: 'Montserrat',
							color: colors.slate[ 600 ],
						} ) }
					/>

					<Column
						modifier={ mod()
							.padding( sp( 32 ) )
							.width( '90%' )
							.centerFlex()
						}
						alignment={ Alignment.Center() }
						arrangement={ Arrangement.SpacedBy( sp( 16 ) ) }
					>
						<TextBox
							type="email"
							value={ email() }
							onInput={ ( e ) => setEmail( ( e.currentTarget as HTMLInputElement ).value ) }
							placeholder="Email address"
							modifier={ mod()
								.background( 'white' )
								.border( '1px solid #ccc' )
								.padding( fp( 8 ) )
								.fontSize( fp( 16 ) )
								.radius( fp( 4 ) )
								.height( fp( 40 ) )
								.fillMaxWidth()
							}
						/>

						<Button
							disabled={ loading() }
							onClick={ async () =>
							{
								if ( loading() ) return
								setLoading( true )
								const emailValue = email().trim()
								if ( !emailValue )
								{
									setMessage( 'Please enter a valid email address.' )
									setLoading( false )
									return
								}
								try
								{
									const response = await fetch(
										'https://us-central1-the-vibes-firebase.cloudfunctions.net/sendCode',
										{
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify( { recipients: [ emailValue ] } ),
										}
									)
									const data = await response.json()
									if ( response.ok )
									{
										setMessage( 'Verification code sent successfully!' )
									} else
									{
										setMessage( `Error: ${ data.error || 'Unknown error' }` )
									}
								} catch ( error: any )
								{
									console.error( 'Error sending verification code:', error )
									setMessage( `Error: ${ error.message || 'Unknown error' }` )
								}
								setLoading( false )
							} }
							modifier={ mod()
								.background( loading() ? '#6c757d' : '#007BFF' )
								.color( 'white' )
								.padding( `${ fp( 10 ) } ${ fp( 20 ) }` )
								.fontSize( fp( 16 ) )
								.border( 'none' )
								.fillMaxWidth()
								.textAlign( 'center' )
								.radius( fp( 4 ) )
								.cursor( loading() ? 'not-allowed' : 'pointer' )
							}
						>
							{ loading() ? 'Sending...' : 'Send Verification Code' }
						</Button>

						{ message() && (
							<Text
								text={ message() }
								modifier={ mod().typography( {
									size: fp( 14 ),
									weight: 400,
									family: 'Montserrat',
									color: colors.slate[ 400 ],
								} ) }
							/>
						) }
					</Column>
				</Box>

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
							.radius( fp( 8 ) ) }
						alignment={ Alignment.Center() }
						arrangement={ Arrangement.SpacedBy( sp( 8 ) ) }
					>
						<Text
							text={ `made with` }
							modifier={ mod().typography( {
								size: fp( 14 ),
								weight: 400,
								family: 'Montserrat',
								color: colors.slate[ 400 ],
							} ) }
						/>
						<Fontawesome
							icon={ FontawesomeIcon.Heart }
							size={ fp( 14 ) }
							color={ colors.slate[ 400 ] }
						/>
						<Text
							text={ `by the.fittle` }
							modifier={ mod().typography( {
								size: fp( 14 ),
								weight: 400,
								family: 'Montserrat',
								color: colors.slate[ 400 ],
							} ) }
						/>
					</Row>
				</Column>
			</Column>
		</Box>
	)
}

// Component
// -----------------------------------------------------------------------------------------------------------
export const App = Object.assign( AppRoot, { Content: AppContent } )
