// import
// {
//     JSX,
//     type ComponentProps,
//     type ValidComponent,
//     type Accessor,
//     type Setter,
//     splitProps,
// } from 'solid-js';

// import
// {
//     type BoxProps,
//     Box,
//     cls,
// }
//     from '../';

// import css from './index.module.css';

// // Root Component
// // -----------------------------------------------------------------------------------------------------------
// export interface ButtonRootOptions
// {
//     value?: string;

//     intention?: 'default' | 'theme' | 'success' | 'warning' | 'error' | 'info';
//     variation?: 'default' | 'solid' | 'soft' | 'text';

//     disabled?: boolean | undefined;
// }

// export type ButtonRootProps<T extends ValidComponent> = BoxProps<T> & ButtonRootOptions;

// export function ButtonRoot<T extends ValidComponent = 'button'> ( props: ButtonRootProps<T> )
// {
//     const [ local, others ] = splitProps( props, [ 'as', 'intention', 'variation', 'disabled' ] );

//     return (
//         <Box
//             as={ local[ 'as' ] || 'button' }
//             class={ cls(
//                 css[ 'button--root' ],
//             ) }
//             attr:disabled={ local[ 'disabled' ] }
//             attr:variation={ local[ 'variation' ] || 'default' }
//             attr:intention={ local[ 'intention' ] || 'default' }
//             { ...others }
//         />
//     );
// }

// // Button Component
// // -----------------------------------------------------------------------------------------------------------
// export const Button = Object.assign( ButtonRoot, {} );
