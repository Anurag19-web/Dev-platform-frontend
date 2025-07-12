import { createBrowserRouter } from "react-router-dom";
import { CommonPage } from "../pages/Common_page";
import { SignUpPage } from "../pages/signup_page";
import { LoginPage } from "../pages/login_page";

export const router_page = createBrowserRouter([
    {
        path:"/",
        element:<CommonPage/>
    },
    {
        path:"/signup",
        element:<SignUpPage/>
    },
    {
        path:"/login",
        element:<LoginPage/>
    },
]
)