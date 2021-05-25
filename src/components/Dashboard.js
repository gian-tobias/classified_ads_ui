import React from "react";
import { AuthContext } from "../App";
import Card from "./Card";
import AddAd from "./AddAd"

export const AdContext = React.createContext();

const initialState = {
  ads: [],
  isFetching: false,
  hasError: false,
  isAdSubmitting: false,
  adHasError: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ADS_REQUEST":
        return {
            ...state,
            isFetching: true,
            hasError: false
        };
    case "FETCH_ADS_SUCCESS":
        return {
            ...state,
            isFetching: false,
            ads: action.payload.ads_list
        };
    case "FETCH_ADS_FAILURE":
        return {
            ...state,
            hasError: true,
            isFetching: false
        };
    case "ADD_AD_REQUEST":
        return {
            ...state,
            isAdSubmitting: true,
            adHasError: false,
        }
    case "ADD_AD_SUCCESS":
        return {
            ...state,
            isAdSubmitting: false,
            ads: [...state.ads, action.payload.new_ad]
        }
    case "ADD_AD_FAILURE":
        return {
            ...state,
            isAdSubmitting: false,
            adHasError: true,
        }
    case "DELETE_AD_REQUEST":
        return {
            ...state,
            adHasError: false,
        }
    case "DELETE_AD_SUCCESS":
        console.log(action.payload)
        return {
            ...state,
            ads: state.ads.filter((item) => item.id !== action.payload)
        }
    default:
        return state;
  }
};
export const Dashboard = () => {
    const { state: authState } = React.useContext(AuthContext);
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [isAddAdModalVisible, setAddAdModalVisibility] = React.useState(false);

    const toggleAddAd = () => {
        setAddAdModalVisibility(!isAddAdModalVisible);
      }
    React.useEffect(() => {
        dispatch({
          type: "FETCH_ADS_REQUEST"
        });
        fetch("http://localhost:5000/ads/list", {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw res;
            }
          })
          .then(resJson => {
            dispatch({
              type: "FETCH_ADS_SUCCESS",
              payload: resJson
            });
          })
          .catch(error => {
            dispatch({
              type: "FETCH_ADS_FAILURE"
            });
          });
      }, [authState.token]);

    return (
        <React.Fragment>
        <AdContext.Provider value={{
            state,
            dispatch
          }}>
            { 
                authState.isAuthenticated ?
                <div>
                <button className="btn" onClick={toggleAddAd}>New Advertisement</button>
                <AddAd onClose={toggleAddAd} show={isAddAdModalVisible} /> 
                </div>:
                <br/>
            }

        <div className="dashboard">
            {state.isFetching ? (
                <span>LOADING...</span>
            ) : state.hasError ? (
                <span>AN ERROR HAS OCCURED</span>
            ) : (
                <>
                {state.ads.length > 0 &&
                    state.ads.map(ad => (
                    <Card key={ad.id.toString()} ad={ad} />
                    ))}
                </>
            )}
        </div>
        </AdContext.Provider>
        
        </React.Fragment>
    );
    };
export default Dashboard;