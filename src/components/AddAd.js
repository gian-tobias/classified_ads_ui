import React from "react";
import { AdContext } from "./Dashboard";
import { AuthContext } from "../App";

function AddAd(props) {
  const { state, dispatch } = React.useContext(AdContext);
  const { state: authState } = React.useContext(AuthContext);

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("CARS");
  const [description, setDescription] = React.useState("");

  const onClose = e => {
    props.onClose && props.onClose(e);
  };

  const isButtonDisabled = title === "" || category === "" || description === "" || state.isAdSubmitting;

  const onSubmit = () => {
    dispatch({
        type: "ADD_AD_REQUEST"
    })
    const ad = {
    "title": title,
    "description": description,
    "category": category,
    "owner_username": authState.username
    };
    fetch("http://localhost:5000/ads/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.access_token}`,
          "Content-Type": `application/json`
        },
        body: JSON.stringify(ad),
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
            setCategory("");
            setTitle("");
            setDescription("");
            dispatch({
                type: "ADD_AD_SUCCESS",
                payload: data
            })
            onClose();
        }).catch(error => {
            dispatch({
                type: "ADD_AD_FAILURE"
            })
        })
  }
    if (!props.show) {
      return null;
    }
    return (
      <div className="modal" id="modal">
        <div>
                <h1>
                  Add New Advertisement
                </h1>
              </div>
              <form>
                <div>

                <label htmlFor="title">Title</label>
                <br/>
                    <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    />
                <br/>
                <label htmlFor="category">Category</label>
                <br/>
                    <select id="category"
                        name="category"
                        type="text"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="CARS">Cars</option>
                        <option value="REAL_ESTATE">Real Estate</option>
                        <option value="CLOTHING">Clothing</option>
                        <option value="ELECTRONICS">Electronics</option>
                        <option value="FOOD">Food</option>
                        <option value="TRAVEL">Travel</option>
                    </select>
                <br/>
                <label htmlFor="description">Description</label>
                <br/>
                    <input
                    id="description"
                    name="description"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    />
                </div>


                
                <div>
                      <p>
                        {state.adHasError && "Error Creating Ad!"}
                      </p>
                </div>
                <div>
                    <button
                      type="button"
                      id="overlay-confirm-button"
                      className="btn"
                      onClick={onSubmit}
                      disabled={isButtonDisabled}
                    >
                      {state.isAdSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      id="overlay-cancel-button"
                      className="btn"
                      onClick={onClose}
                    >
                          Cancel
                    </button>
                </div>
              </form>
      </div>
    );
};

export default AddAd;