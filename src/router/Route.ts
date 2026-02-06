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
  RENT: "rent",
  LOCATION: "location",
  MAP: "map",
  SUPPORT: "support",
  DOCS: "docs",
  MYLOCATION: "my-location",

  ROOMDETAIL: "room-detail",

  //Rent
  UPLOAD: "upload",
  // Home
  FILTER: "filter",
  //Renter
  RENTER: "renter",
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
  RENT: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.RENT}`,
  LOCATION: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.LOCATION}`,
  MAP: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.MAP}`,
  SUPPORT: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.SUPPORT}`,
  DOCS: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.DOCS}`,
  FILTER: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.FILTER}`,
  MYLOCATION: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.MYLOCATION}`,
  ROOMDETAIL: `${ROUTER}/${ROUTER_NAME.HOME}/${ROUTER_NAME.ROOMDETAIL}/:roomId`,
  //Renter
  RENTER: `${ROUTER}/${ROUTER_NAME.RENTER}`,
};
