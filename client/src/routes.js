import Home from "./views/Home";
import Lobby from "./views/Lobby";
import OauthRedirect from './views/OauthRedirect';

var routes = [
  {
    path: "/",
    name: "Home",
    icon: "",
    component: Home,
    protected: false,
    exact: true
  },
  {
    path: "/lobby",
    name: "Lobby",
    icon: "",
    component: Lobby,
    protected: true,
    exact: false

  },
  {
    path: "/auth/google/redirect",
    name: "OauthRedirect",
    icon: "",
    component: OauthRedirect,
    protected: false,
    exact: true
  }
];

export default routes;