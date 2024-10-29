import { combineReducers } from "redux";
import  storage  from "redux-persist/lib/storage";
import addressReducer from "./Slices/address.js";
// import appReducer from "./Slices/app.js";
// import authReducer from "./Slices/auth.js";
// import conversationReducer from "./Slices/conversation.js";
const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist:[],
  // blacklist:[],
};

const rootReducer = combineReducers({
    address:addressReducer
    // auth:authReducer,
    // conversation:conversationReducer,
});

export {rootPersistConfig,rootReducer};