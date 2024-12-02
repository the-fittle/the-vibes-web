export { v4 as createId } from 'uuid';
export * from './components';
export * from './views';
export * from './util';

import { render } from 'solid-js/web';
import { App } from './views/app';

// import 'virtual:uno.css';
import './index.css';

render( () => <App />, document.body );


// Firebase
// -----------------------------------------------------------------------------------------------------------

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyCK7qqjpPXl0OVHQWeRiRSApzKPK9ZUlE8",
//     authDomain: "the-vibes-firebase.firebaseapp.com",
//     projectId: "the-vibes-firebase",
//     storageBucket: "the-vibes-firebase.firebasestorage.app",
//     messagingSenderId: "491108657741",
//     appId: "1:491108657741:web:d3a0aa28b09a23ee4bca04",
//     measurementId: "G-LE6PHZDW3F"
// };

// // Initialize Firebase
// const app = initializeApp( firebaseConfig );
// const analytics = getAnalytics( app );
