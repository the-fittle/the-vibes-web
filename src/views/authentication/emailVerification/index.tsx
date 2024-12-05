import { Box, Row, Column, Text, Spacer, TextBox, Button } from '@/components';
import { mod, fp, sp, Alignment, Arrangement } from '@/components/util';
import { useAppContext } from '@/views/app';
import { createSignal } from 'solid-js';

export function EmailVerification ()
{
    return (
        <Box modifier={
            mod().fillMaxSize()
        }>
            <Box modifier={
                mod().centerFlex()
            }>
                <h1>Email Verification</h1>
            </Box>
        </Box>
    );
}