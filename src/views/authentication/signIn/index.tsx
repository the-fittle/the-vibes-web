import { Box, Row, Column, Text, Spacer, TextBox, Button } from '@/components';
import { Alignment, Arrangement, ModifierMedia, mod, colors, fp, sp } from '@/components/util';
import { useAppContext } from '@/views/app';
import { createSignal } from 'solid-js';

export function SignIn ()
{
    const context = useAppContext();

    const [ email, setEmail ] = createSignal( '' );
    const [ message, setMessage ] = createSignal( '' );
    const [ loading, setLoading ] = createSignal( false );

    return (
        <Box modifier={
            mod()
                .fillMaxSize()
        }>
            <Column
                modifier={
                    mod()
                        .fillMaxSize()
                        .padding( fp( 32 ) )
                }
                alignment={ Alignment.Center() }
                arrangement={ Arrangement.Center() }
            >
                <Column modifier={
                    mod()
                        .centerFlex()
                        .background( colors.white )
                        .when( ModifierMedia.Mobile,
                            mod()
                                .fillMaxWidth()
                        )
                }
                    alignment={ Alignment.Start() }
                    arrangement={ Arrangement.SpacedBy( fp( 16 ) ) }
                >
                    <Text text='Hello, Vibes!'
                        modifier={
                            mod()
                                .fontSize( sp( 24 ) )
                                .fontFamily( 'montserrat' )
                                .fontWeight( 800 )
                        } />

                    <Spacer modifier={ mod().weight( 1 ) } />

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
                            if ( loading() ) return;
                            setLoading( true );
                            const emailValue = email().trim();
                            if ( !emailValue )
                            {
                                setMessage( 'Please enter a valid email address.' );
                                setLoading( false );
                                return;
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
                                        body: JSON.stringify( {
                                            recipients: [ emailValue ],
                                        } ),
                                    }
                                );
                                const data = await response.json();
                                if ( response.ok )
                                {
                                    setMessage( 'Verification code sent successfully!' );
                                } else
                                {
                                    setMessage( `Error: ${ data.error || 'Unknown error' }` );
                                }
                            } catch ( error: any )
                            {
                                console.error( 'Error sending verification code:', error );
                                setMessage( `Error: ${ error.message || 'Unknown error' }` );
                            }
                            setLoading( false );
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
                            modifier={
                                mod()
                                    .fontSize( sp( 16 ) )
                                    .fontFamily( 'montserrat' )
                                    .fontWeight( 400 )
                            }
                        />
                    ) }
                </Column>
            </Column>
        </Box>
    );
}