import
{
    sendCustomEmail as mailgunSendCustomEmail,
    sendTemplateEmail as mailgunSendTemplateEmail,
} from './client'
import { Templates } from './templates'

interface SendCustomEmailOptions
{
    recipients: string[]
    subject: string
    html?: string
    text?: string
    from?: string
    replyTo?: string
}

interface SendTemplateEmailOptions
{
    recipients: string[]
    templateName: string
    variables?: Record<string, any>
    recipientVariables?: Record<string, any>
    subject?: string
    from?: string
    replyTo?: string
}

/**
 * Sends a custom email with specified HTML or text content.
 * @param options - The email sending options.
 */
export async function sendCustomEmail ( options: SendCustomEmailOptions ): Promise<void>
{
    await mailgunSendCustomEmail( options )
}

/**
 * Sends an email using a Mailgun template.
 * @param options - The email sending options.
 */
export async function sendTemplateEmail ( options: SendTemplateEmailOptions ): Promise<void>
{
    await mailgunSendTemplateEmail( options )
}

/**
 * Sends verification code emails to recipients using a template.
 * @param recipients - Array of recipient email addresses.
 * @param recipientVariables - Recipient variables containing codes.
 */
export async function sendVerificationEmails (
    recipients: string[],
    recipientVariables: Record<string, { code: string }>
): Promise<void>
{
    await sendTemplateEmail( {
        recipients,
        templateName: Templates.VERIFICATION_CODE,
        recipientVariables,
    } )
}
