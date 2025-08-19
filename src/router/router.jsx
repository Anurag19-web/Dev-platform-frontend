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
import { Setting } from "../pages/setting_page";
import { VoiceNavigator } from "../pages/VoiceNavigator";
import { CreatePost } from "../Posts/CreatePost";
import { PostsList } from "../Posts/PostList";
import { SearchPage } from "../pages/searchPage";
import { Likes } from "../Posts/Likes";
import { PostCard } from "../Posts/PostCard.jsx";

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
    {
        path:"/setting",
        element:<ProtectedRoot>
                <Setting/>
                </ProtectedRoot>
    },
    {
        path:"/voice",
        element:<ProtectedRoot>
                <VoiceNavigator/>
                </ProtectedRoot>
    },
    {
        path:"/postcreate",
        element:<ProtectedRoot>
                <CreatePost/>
                </ProtectedRoot>
    },
    {
        path:"/postlist/:userId",
        element:<ProtectedRoot>
                <PostsList/>
                </ProtectedRoot>
    },
    {
        path:"/search",
        element:<ProtectedRoot>
                <SearchPage/>
                </ProtectedRoot>
    },
    {
        path:"/likes/:postId",
        element:<ProtectedRoot>
                <Likes/>
                </ProtectedRoot>
    },
    {
        path:"/postcard",
        element:<ProtectedRoot>
                <PostCard/>
                </ProtectedRoot>
    },
]
)