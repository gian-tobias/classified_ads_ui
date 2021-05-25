import React from "react";
import { AdContext } from "./Dashboard";
import { AuthContext } from "../App";

export const Card = ({ ad }) => {
    const { state, dispatch } = React.useContext(AdContext);
    const { state: authState } = React.useContext(AuthContext);

    const onDelete = () => {
        dispatch({
            type: "DELETE_AD_REQUEST"
        })
    
        fetch(`http://localhost:5000/ads/${ad.id}/delete`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${authState.access_token}`,
            "Content-Type": `application/json`
            }
        })
            .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
            })
            .then(data => {
                console.log(data);
                dispatch({
                    type: "DELETE_AD_SUCCESS",
                    payload: data.deleted_ad
                })
            })
        }
    return (
        <div className="card">
            <div>
                <h2>{ad.title}</h2>
                <h3>Category: {ad.category}</h3>
                <p>Description: {ad.description}</p>
                <span>Owner: {ad.ad_owner}</span>
            </div>
            { 
                authState.isAuthenticated && authState.username === ad.ad_owner ?
                <div>
                    <button
                        className="btn"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                    <button className="btn">Edit</button>
                </div>:
                <br/>
            }
        </div>
    );
};
export default Card;