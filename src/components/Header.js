import React from "react";
import { AuthContext } from "../App";
import Login from "./Login"
import AddAd from "./AddAd"
import { Modal } from '@material-ui/core'

function Header() {
    const { state, dispatch } = React.useContext(AuthContext);
    
    const [openLogin, setOpenLogin] = React.useState(false);
    const handleOpen = () => {
        setOpenLogin(true);
    };
    const handleClose = () => {
        setOpenLogin(false);
    };
    if (state.isAuthenticated && openLogin) {
        setOpenLogin(false)
    }
    return (
        <>
        <header className="navBar">
            <h1>Gian's Classified Ads</h1>
            <div className="buttonGrp">
                { 
                    state.isAuthenticated ?
                    <button
                        className="btn"
                        onClick={() => dispatch({type: "LOGOUT"})}
                    >
                        Hello, {state.username} (LOGOUT)
                    </button> :
                    (<button
                        className="btn"
                        onClick={() => {
                            handleOpen()
                        }}
                    >
                    LOGIN
                    </button>) 
                }
            </div>
        </header>
        <Modal
            open={openLogin}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="loginModal"
        >
            <Login/>
        </Modal>
        </>
    );
};

export default Header