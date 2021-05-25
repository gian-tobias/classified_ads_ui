import React from "react";
import { AuthContext } from "../App";

function Login() {
    const { dispatch } = React.useContext(AuthContext);
    const initialState = {
        email: "",
        password: "",
        isSubmitting: false,
        errorMessage: null,
        show: false,
    };
    const [data, setData] = React.useState(initialState);
    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };
    const handleFormSubmit = event => {
        event.preventDefault();
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        });
        fetch("http://localhost:5000/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: data.email,
            password: data.password
        })
        })
        .then(res => {
            if (res.ok) {
            return res.json();
            }
            throw res;
        })
        .then(resJson => {
            dispatch({
                type: "LOGIN",
                payload: resJson
            })
        })
        .catch(error => {
            setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message || error.statusText
            });
        });
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleFormSubmit}>
            <h2 className="loginHeader">Login</h2>

            <label 
                htmlFor="email"
                className="formColumn"
            >
                Email Address
            </label>
            <input
                type="text"
                value={data.email}
                onChange={handleInputChange}
                name="email"
                id="email"
                className="formColumn"
                />
            <label htmlFor="password">
                Password
                <input
                type="password"
                value={data.password}
                onChange={handleInputChange}
                name="password"
                id="password"
                className="formColumn"
                />
            </label>

            {data.errorMessage && (
                <span className="form-error">{data.errorMessage}</span>
            )}

            <button className="btn" disabled={data.isSubmitting}>
                {data.isSubmitting ? (
                "Loading..."
                ) : (
                "Login"
                )}
            </button>
            </form>
        </div>
    );
    };
export default Login;