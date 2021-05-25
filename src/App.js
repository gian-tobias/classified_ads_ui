import React from "react";
import './App.css';
import Header from "./components/Header"
import { Dashboard } from "./components/Dashboard"

export  const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  username: null,
  access_token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.username))
      localStorage.setItem("token", JSON.stringify(action.payload.access_token))
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        access_token: action.payload.access_token
      };
    case "LOGOUT":
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={{state, dispatch}}>
      <div className="container">
        <Header />
        <Dashboard />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
