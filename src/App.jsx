import { RouterProvider } from 'react-router-dom'
import { router_page } from './router/router'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("bgTheme");
    if (savedTheme) {
      document.body.style.background = savedTheme;
    }
  }, []);
  return (
    <>
      <RouterProvider router={router_page}/>
    </>
  )
}

export default App