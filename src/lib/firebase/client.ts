'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  projectId: "garena-gears",
  appId: "1:93335858315:web:9ef6be42c3b81a236ab88e",
  storageBucket: "garena-gears.firebasestorage.app",
  apiKey: "AIzaSyAowX6z6IDuosoxlfclYkgof5HXC27UEmA",
  authDomain: "garena-gears.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "93335858315"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
