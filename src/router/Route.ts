const ROUTER = "";

export const ROUTER_NAME = {
  //Authen start
  SIGN_IN: "",
  SIGN_UP: "sign-up",
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  VERIFY_EMAIL: "verify-email",
  //Authen ends

  // Home
  HOME: "home",
  HOME_PAGE: "home-page",
  RENT: "rent/:rent?",
  LOCATION: "location/:location?",
  MAP: "map",
  SUPPORT: "support",
  DOCS: "docs",
  // Home
};

export const ROUTER_PATH = {
  //Authen start
  SIGN_IN: `${ROUTER}/${ROUTER_NAME.SIGN_IN}`,
  SIGN_UP: `${ROUTER}/${ROUTER_NAME.SIGN_UP}`,
  FORGOT_PASSWORD: `${ROUTER}/${ROUTER_NAME.FORGOT_PASSWORD}`,
  RESET_PASSWORD: `${ROUTER}/${ROUTER_NAME.RESET_PASSWORD}`,
  VERIFY_EMAIL: `${ROUTER}/${ROUTER_NAME.VERIFY_EMAIL}`,
  //Authen ends
  //Home
  HOME: `${ROUTER}/${ROUTER_NAME.HOME}`,
  HOME_PAGE: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.HOME_PAGE}`,
  RENT: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.RENT}`,
  LOCATION: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.LOCATION}`,
  MAP: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.MAP}`,
  SUPPORT: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.SUPPORT}`,
  DOCS: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.DOCS}`,
  //Home
};
