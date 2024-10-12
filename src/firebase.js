import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyDmpGl6QkTggDZPUQE9TLHNUNYp2gBMdW4',
	authDomain: 'taska-f2ac2.firebaseapp.com',
	projectId: 'taska-f2ac2',
	storageBucket: 'taska-f2ac2.appspot.com',
	messagingSenderId: '343126579403',
	appId: '1:343126579403:web:16210d84fc58339b96634e',
	databaseURL: 'https://taska-f2ac2-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
