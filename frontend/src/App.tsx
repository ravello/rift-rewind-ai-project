import * as React from "react";
import { HeroUIProvider } from '@heroui/react';
import './App.css';

function MyApplication() {
  return (
    <>
      <h1>Hello, World</h1>
      <h2>This is the start of the app</h2>
    </>
  );
}

function App() {
  return (
    <HeroUIProvider>
      <MyApplication />
    </HeroUIProvider>
  )
}

export default App
