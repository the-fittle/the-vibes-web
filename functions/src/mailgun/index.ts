import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as cors from 'cors'
import { sendVerificationEmails, sendCustomEmail, sendTemplateEmail } from './transporter'

admin.initializeApp()
const db = admin.firestore()

const corsHandler = cors( { origin: true } )

/**
 * HTTP Function: sendCode
 * Sends verification codes to the specified recipients if they do not already exist.
 */
export const sendCode = functions.https.onRequest( ( req, res ) =>
{
    corsHandler( req, res, async () =>
    {
        try
        {
            if ( req.method !== 'POST' )
            {
                res.status( 405 ).json( { error: 'Method Not Allowed. Use POST.' } )
                return
            }

            const recipients: string[] = req.body.recipients
            if ( !recipients || !Array.isArray( recipients ) || recipients.length === 0 )
            {
                res.status( 400 ).json( {
                    error: 'Invalid argument: A list of recipients is required.',
                } )
                return
            }

            const recipientVariables: Record<string, { code: string }> = {}
            const emailsToSend: string[] = []
            const existingEmails: string[] = []

            await Promise.all(
                recipients.map( async ( recipient ) =>
                {
                    try
                    {
                        await admin.auth().getUserByEmail( recipient )
                        existingEmails.push( recipient )
                    } catch ( error: any )
                    {
                        if ( error.code === 'auth/user-not-found' )
                        {
                            emailsToSend.push( recipient )

                            const code = Math.floor( 100000 + Math.random() * 900000 ).toString()
                            const expiresAt = Date.now() + 10 * 60 * 1000

                            await db
                                .collection( 'verificationCodes' )
                                .doc( recipient )
                                .set( { code, expiresAt } )

                            recipientVariables[ recipient ] = { code }
                        } else
                        {
                            console.error( `Error checking user ${ recipient }:`, error )
                            throw error
                        }
                    }
                } )
            )

            if ( emailsToSend.length > 0 )
            {
                await sendVerificationEmails( emailsToSend, recipientVariables )
            }

            res.status( 200 ).json( {
                success: true,
                emailsSent: emailsToSend,
                existingEmails,
            } )
        } catch ( error )
        {
            console.error( 'Error sending codes:', error )
            res.status( 500 ).json( {
                error: 'Internal error: Failed to send verification codes.',
            } )
        }
    } )
} )

/**
 * HTTP Function: verifyCode
 * Verifies the provided code for the specified recipient and creates a Firebase user.
 */
export const verifyCode = functions.https.onRequest( ( req, res ) =>
{
    corsHandler( req, res, async () =>
    {
        try
        {
            if ( req.method !== 'POST' )
            {
                res.status( 405 ).json( { error: 'Method Not Allowed. Use POST.' } )
                return
            }

            const recipient: string = req.body.recipient
            const code: string = req.body.code
            if ( !recipient || !code )
            {
                res.status( 400 ).json( {
                    error: 'Invalid argument: Both recipient and code are required.',
                } )
                return
            }

            try
            {
                await admin.auth().getUserByEmail( recipient )
                res.status( 400 ).json( {
                    error: 'User already exists with this email address.',
                } )
                return
            } catch ( error: any )
            {
                if ( error.code !== 'auth/user-not-found' )
                {
                    console.error( `Error checking user ${ recipient }:`, error )
                    throw error
                }
            }

            const doc = await db.collection( 'verificationCodes' ).doc( recipient ).get()
            if ( !doc.exists )
            {
                res.status( 404 ).json( { error: 'Verification code not found.' } )
                return
            }

            const data = doc.data() as { code: string; expiresAt: number }
            const { code: storedCode, expiresAt } = data

            if ( storedCode !== code )
            {
                res.status( 400 ).json( {
                    error: 'Invalid argument: Incorrect verification code.',
                } )
                return
            }

            if ( Date.now() > expiresAt )
            {
                res.status( 400 ).json( {
                    error: 'Invalid argument: Verification code has expired.',
                } )
                return
            }

            const user = await admin.auth().createUser( { email: recipient, emailVerified: true } )

            await db.collection( 'verificationCodes' ).doc( recipient ).delete()

            res.status( 200 ).json( { success: true, userId: user.uid } )
        } catch ( error )
        {
            console.error( 'Error verifying code:', error )
            res.status( 500 ).json( {
                error: 'Internal error: Failed to verify code or create user.',
            } )
        }
    } )
} )

/**
 * HTTP Function: sendCustomEmail
 * Sends custom emails with specified content to the given recipients.
 */
export const sendCustomEmailFunction = functions.https.onRequest( ( req, res ) =>
{
    corsHandler( req, res, async () =>
    {
        try
        {
            if ( req.method !== 'POST' )
            {
                res.status( 405 ).json( { error: 'Method Not Allowed. Use POST.' } )
                return
            }

            const { recipients, subject, html, text, from, replyTo } = req.body

            if (
                !recipients ||
                !Array.isArray( recipients ) ||
                recipients.length === 0 ||
                !subject ||
                ( !html && !text )
            )
            {
                res.status( 400 ).json( {
                    error:
                        'Invalid argument: Recipients, subject, and at least one of html or text are required.',
                } )
                return
            }

            await sendCustomEmail( {
                recipients,
                subject,
                html,
                text,
                from,
                replyTo,
            } )

            res.status( 200 ).json( { success: true } )
        } catch ( error )
        {
            console.error( 'Error sending custom emails:', error )
            res.status( 500 ).json( {
                error: 'Internal error: Failed to send custom emails.',
            } )
        }
    } )
} )

/**
 * HTTP Function: sendTemplateEmail
 * Sends emails using a specified Mailgun template.
 */
export const sendTemplateEmailFunction = functions.https.onRequest( ( req, res ) =>
{
    corsHandler( req, res, async () =>
    {
        try
        {
            if ( req.method !== 'POST' )
            {
                res.status( 405 ).json( { error: 'Method Not Allowed. Use POST.' } )
                return
            }

            const { recipients, templateName, variables, recipientVariables, subject, from, replyTo } = req.body

            if (
                !recipients ||
                !Array.isArray( recipients ) ||
                recipients.length === 0 ||
                !templateName
            )
            {
                res.status( 400 ).json( {
                    error:
                        'Invalid argument: Recipients and templateName are required.',
                } )
                return
            }

            await sendTemplateEmail( {
                recipients,
                templateName,
                variables,
                recipientVariables,
                subject,
                from,
                replyTo,
            } )

            res.status( 200 ).json( { success: true } )
        } catch ( error )
        {
            console.error( 'Error sending template emails:', error )
            res.status( 500 ).json( {
                error: 'Internal error: Failed to send template emails.',
            } )
        }
    } )
} )
