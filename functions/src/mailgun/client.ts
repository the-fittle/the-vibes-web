import axios from 'axios'
import { getSecret } from './secrets'

interface MailgunBaseOptions
{
    recipients: string[]
    from?: string
    replyTo?: string
}

interface CustomEmailOptions extends MailgunBaseOptions
{
    subject: string
    html?: string
    text?: string
}

interface TemplateEmailOptions extends MailgunBaseOptions
{
    templateName: string
    subject?: string
    variables?: Record<string, any>
    recipientVariables?: Record<string, any>
}

export async function sendCustomEmail ( options: CustomEmailOptions ): Promise<void>
{
    const { recipients, subject, from, replyTo, html, text } = options

    const MAILGUN_API_KEY = await getSecret( 'MAILGUN_API_KEY' )
    const MAILGUN_DOMAIN = await getSecret( 'MAILGUN_DOMAIN' )
    const sender = from || ( await getSecret( 'MAILGUN_SENDER' ) )

    const data = new URLSearchParams()
    data.append( 'from', sender )
    data.append( 'to', recipients.join( ',' ) )
    data.append( 'subject', subject )

    if ( replyTo )
    {
        data.append( 'h:Reply-To', replyTo )
    }

    if ( html )
    {
        data.append( 'html', html )
    }
    if ( text )
    {
        data.append( 'text', text )
    }

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
            console.error( 'Error sending custom email via Mailgun:', error.response?.data || error.message )
        } else if ( error instanceof Error )
        {
            console.error( 'Error sending custom email via Mailgun:', error.message )
        } else
        {
            console.error( 'Error sending custom email via Mailgun:', error )
        }
        throw new Error( 'Failed to send custom email via Mailgun.' )
    }
}

export async function sendTemplateEmail ( options: TemplateEmailOptions ): Promise<void>
{
    const {
        recipients,
        from,
        replyTo,
        templateName,
        subject,
        variables = {},
        recipientVariables = {},
    } = options

    const MAILGUN_API_KEY = await getSecret( 'MAILGUN_API_KEY' )
    const MAILGUN_DOMAIN = await getSecret( 'MAILGUN_DOMAIN' )
    const sender = from || ( await getSecret( 'MAILGUN_SENDER' ) )

    const data = new URLSearchParams()
    data.append( 'from', sender )
    data.append( 'to', recipients.join( ',' ) )
    data.append( 'template', templateName )

    if ( replyTo )
    {
        data.append( 'h:Reply-To', replyTo )
    }

    if ( subject )
    {
        data.append( 'subject', subject )
    }

    if ( Object.keys( variables ).length > 0 )
    {
        data.append( 'h:X-Mailgun-Variables', JSON.stringify( variables ) )
    }

    if ( Object.keys( recipientVariables ).length > 0 )
    {
        data.append( 'recipient-variables', JSON.stringify( recipientVariables ) )
    }

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
            console.error( 'Error sending template email via Mailgun:', error.response?.data || error.message )
        } else if ( error instanceof Error )
        {
            console.error( 'Error sending template email via Mailgun:', error.message )
        } else
        {
            console.error( 'Error sending template email via Mailgun:', error )
        }
        throw new Error( 'Failed to send template email via Mailgun.' )
    }
}
