import { RouterProvider } from 'react-router-dom'
import { router_page } from './router/router'

function App() {
  return (
    <>
      <RouterProvider router={router_page}/>
    </>
  )
}

export default App