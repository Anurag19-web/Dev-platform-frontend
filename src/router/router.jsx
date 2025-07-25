import { createBrowserRouter } from "react-router-dom";
import { CommonPage } from "../pages/Common_page";
import { SignUpPage } from "../pages/signup_page";
import { LoginPage } from "../pages/login_page";
import { HomePage } from "../pages/Home_page";
import { UserProfile } from "../UserProfile/UserProfile";
import { ProtectedRoot } from "./ProtectRoot";
import { UserProfileEdit } from "../UserProfile/UserProfileEdit";
import { UserProfilesData } from "../UserProfile/UserProfilesData";
import { FollowList } from "../pages/FollowList";

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
        path:"*",
        element: <SignUpPage/>
    },
    {
        path:"/login",
        element:<LoginPage/>
    },
    {
        path:"/home",
        element:<ProtectedRoot>
                <HomePage/>
                </ProtectedRoot>
    },
    {
        path:"/userprofile",
        element:<ProtectedRoot>
                <UserProfile/>
                </ProtectedRoot>
    },
    {
        path:"/userprofilesdata/:id",
        element:<ProtectedRoot>
                <UserProfilesData/>
                </ProtectedRoot>
    },
    {
        path:"/usereditprofile",
        element:<ProtectedRoot>
                <UserProfileEdit/>
                </ProtectedRoot>
    },
    {
        path:"/followlist/:id",
        element:<ProtectedRoot>
                <FollowList/>
                </ProtectedRoot>
    },
]
)