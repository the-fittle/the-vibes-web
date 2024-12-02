// client.ts
import axios from 'axios'
import { getSecret } from './secrets'

interface MailgunEmailOptions
{
    recipients: string[]
    templateName: string
    recipientVariables: Record<string, any>
    subject?: string
    from?: string
}

/**
 * Sends an email using Mailgun's HTTP API.
 * @param options - The email sending options.
 */
export async function sendMailgunEmail ( options: MailgunEmailOptions ): Promise<void>
{
    const { recipients, templateName, recipientVariables, subject = '', from } = options

    const MAILGUN_API_KEY = await getSecret( 'MAILGUN_API_KEY' )
    const MAILGUN_DOMAIN = await getSecret( 'MAILGUN_DOMAIN' )
    const sender = from || ( await getSecret( 'MAILGUN_SENDER' ) )

    const data = new URLSearchParams()
    data.append( 'from', sender )
    data.append( 'to', recipients.join( ',' ) )
    if ( subject )
    {
        data.append( 'subject', subject )
    }
    data.append( 'template', templateName )
    data.append( 'recipient-variables', JSON.stringify( recipientVariables ) )

    const auth = {
        username: 'api',
        password: MAILGUN_API_KEY,
    }

    try
    {
        await axios.post( `https://api.mailgun.net/v3/${ MAILGUN_DOMAIN }/messages`, data, { auth } )
    } catch ( error )
    {
        if ( axios.isAxiosError( error ) )
        {
            console.error( '(axios): Error sending email via Mailgun:', error.response?.data || error.message )
        } else if ( error instanceof Error )
        {
            console.error( '(default): Error sending email via Mailgun:', error.message )
        } else
        {
            console.error( '(unknown): Error sending email via Mailgun:', error )
        }

        throw new Error( 'Failed to send emails via Mailgun.' )
    }
}
