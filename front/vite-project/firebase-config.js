// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6HpEmxzBgV7hhonU39htf2_bn7BbqaY0",
  authDomain: "jobseek-b043f.firebaseapp.com",
  projectId: "jobseek-b043f",
  storageBucket: "jobseek-b043f.appspot.com",
  messagingSenderId: "299354154187",
  appId: "1:299354154187:web:4ab753da63d78dec96e74e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export let storage = getStorage(app);
export const uploadProfilePicToFirebase = async (file) => {
  const storageRef = ref(storage, `profile_pictures/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
};
