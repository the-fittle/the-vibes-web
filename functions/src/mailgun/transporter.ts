// transporter.ts
import { sendMailgunEmail } from './client'
import { Templates } from './templates'

interface SendEmailOptions
{
    recipients: string[]
    templateName: string
    recipientVariables: Record<string, any>
    subject?: string
    from?: string
}

/**
 * Sends an email using the Mailgun HTTP API.
 * @param options - The email sending options.
 */
export async function sendEmail ( options: SendEmailOptions ): Promise<void>
{
    await sendMailgunEmail( options )
}

/**
 * Sends verification code emails to recipients.
 * @param recipients - Array of recipient email addresses.
 * @param recipientVariables - Recipient variables containing codes.
 */
export async function sendVerificationEmails (
    recipients: string[],
    recipientVariables: Record<string, { code: string }>
): Promise<void>
{
    await sendMailgunEmail( {
        recipients,
        templateName: Templates.VERIFICATION_CODE,
        recipientVariables,
    } )
}

/**
 * Sends welcome emails to recipients.
 * @param recipients - Array of recipient email addresses.
 */
export async function sendWelcomeEmails ( recipients: string[] ): Promise<void>
{
    await sendMailgunEmail( {
        recipients,
        templateName: Templates.WELCOME_EMAIL,
        recipientVariables: {},
    } )
}
