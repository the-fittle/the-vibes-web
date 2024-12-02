// index.ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { sendVerificationEmails } from './transporter'

admin.initializeApp()
const db = admin.firestore()

/**
 * HTTP Function: sendCode
 * Sends verification codes to the specified recipients.
 */
export const sendCode = functions.https.onRequest( async ( req, res ) =>
{
    try
    {
        // Enforce POST method
        if ( req.method !== 'POST' )
        {
            res.status( 405 ).json( { error: 'Method Not Allowed. Use POST.' } )
            return
        }

        // Extract and validate recipients
        const recipients: string[] = req.body.recipients
        if ( !recipients || !Array.isArray( recipients ) || recipients.length === 0 )
        {
            res.status( 400 ).json( {
                error: 'Invalid argument: A list of recipients is required.',
            } )
            return
        }

        // Prepare recipient variables and save codes to Firestore
        const recipientVariables: Record<string, { code: string }> = {}

        await Promise.all(
            recipients.map( async ( recipient ) =>
            {
                // Generate unique code and expiration time
                const code = Math.floor( 100000 + Math.random() * 900000 ).toString()
                const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

                // Save code to Firestore
                await db
                    .collection( 'verificationCodes' )
                    .doc( recipient )
                    .set( { code, expiresAt } )

                // Add personalized variables for this recipient
                recipientVariables[ recipient ] = { code }
            } )
        )

        // Send verification emails
        await sendVerificationEmails( recipients, recipientVariables )

        res.status( 200 ).json( { success: true } )
    } catch ( error )
    {
        console.error( 'Error sending codes:', error )
        res.status( 500 ).json( {
            error: 'Internal error: Failed to send verification codes.',
        } )
    }
} )

/**
 * HTTP Function: verifyCode
 * Verifies the provided code for the specified recipient and creates a Firebase user.
 */
export const verifyCode = functions.https.onRequest( async ( req, res ) =>
{
    try
    {
        // Enforce POST method
        if ( req.method !== 'POST' )
        {
            res.status( 405 ).json( { error: 'Method Not Allowed. Use POST.' } )
            return
        }

        // Extract and validate recipient and code
        const recipient: string = req.body.recipient
        const code: string = req.body.code
        if ( !recipient || !code )
        {
            res.status( 400 ).json( {
                error: 'Invalid argument: Both recipient and code are required.',
            } )
            return
        }

        // Retrieve code from Firestore
        const doc = await db.collection( 'verificationCodes' ).doc( recipient ).get()
        if ( !doc.exists )
        {
            res.status( 404 ).json( { error: 'Verification code not found.' } )
            return
        }

        const data = doc.data() as { code: string; expiresAt: number }
        const { code: storedCode, expiresAt } = data

        // Validate code and expiration
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

        // Check if user already exists
        let user
        try
        {
            user = await admin.auth().getUserByEmail( recipient )
        } catch ( error )
        {
            // User does not exist, create new user
            user = await admin.auth().createUser( { email: recipient, emailVerified: true } )
        }

        // Delete code from Firestore
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
