import type { ReactElement } from "react";
import HomePage from "@/modules/home/pages/HomePage";
import LandingPage from "@/modules/landing/pages/LandingPage";
import ComingSoon from "@/pages/ComingSoon";
import LearnPage from "@/pages/LearnPage";
import ArticlePage from "@/pages/ArticlePage";
import Admin from "@/pages/Admin";
import CreateBounty from "@/pages/CreateBounty";
import Explore from "@/pages/Explore";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ProfileSetup from "@/pages/ProfileSetup";
import VerifyCode from "@/pages/VerifyCode";
import ProfilePage from "@/pages/Profile";

type AppRouteConfig = {
  path: string;
  element: ReactElement;
};

export const appRoutes: AppRouteConfig[] = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/landing", element: <LandingPage /> },
  { path: "/explore", element: <Explore /> },
  { path: "/learn", element: <LearnPage /> },
  { path: "/learn/article/:slug", element: <ArticlePage /> },
  { path: "/earn", element: <ComingSoon /> },
  { path: "/login", element: <Login /> },
  { path: "/verify-code", element: <VerifyCode /> },
  { path: "/profile-setup", element: <ProfileSetup /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/admin", element: <Admin /> },
  { path: "/create-bounty", element: <CreateBounty /> },
  { path: "/fm-launchpad", element: <ComingSoon /> },
  { path: "*", element: <NotFound /> },
];
