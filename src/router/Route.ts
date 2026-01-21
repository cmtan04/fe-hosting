const ROUTER = "";

export const ROUTER_NAME = {
  //Authen start
  SIGN_IN: "",
  SIGN_UP: "sign-up",
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  VERIFY_EMAIL: "verify-email",
  //Authen ends

  DASH_BOARD: "dash-board",
};

export const ROUTER_PATH = {
  //Authen start
  SIGN_IN: `${ROUTER}/${ROUTER_NAME.SIGN_IN}`,
  SIGN_UP: `${ROUTER}/${ROUTER_NAME.SIGN_UP}`,
  FORGOT_PASSWORD: `${ROUTER}/${ROUTER_NAME.FORGOT_PASSWORD}`,
  RESET_PASSWORD: `${ROUTER}/${ROUTER_NAME.RESET_PASSWORD}`,
  VERIFY_EMAIL: `${ROUTER}/${ROUTER_NAME.VERIFY_EMAIL}`,
  //Authen ends
  DASH_BOARD: `${ROUTER}/${ROUTER_NAME.DASH_BOARD}`,
};
