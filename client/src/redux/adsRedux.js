import { API_URL } from '../config';

// adsRedux.js

// selectors
export const getAllAds = (state) => state.ads;
export const getAdById = (state, adId) =>
  state.ads.find((ad) => ad._id === adId) || null;


// actions
const createActionName = (actionName) => `app/ads/${actionName}`;
const CREATE_AD = createActionName('CREATE_AD');
const DELETE_AD = createActionName('DELETE_AD');
const EDIT_AD = createActionName('EDIT_AD');
const UPDATE_ADS = createActionName('UPDATE_ADS');

// action creators
// export const createAd = (ad) => ({ type: CREATE_AD, payload: ad });
// export const deleteAd = (adId) => ({ type: DELETE_AD, payload: adId });
// export const editAd = (ad) => ({ type: EDIT_AD, payload: ad });
export const updateAds = (updatedAdData) => ({
  type: UPDATE_ADS,
  payload: { ads: updatedAdData },
});
export const fetchAds = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${API_URL}api/ads`);
      const data = await response.json();
      dispatch(updateAds(data));
    } catch (error) {
      console.log(error);
    }
  };
};

// reducer
const adsReducer = (statePart = [], action) => {
  switch (action.type) {
    case CREATE_AD:
      return [...statePart, action.payload];
    case DELETE_AD:
      return statePart.filter((ad) => ad._id !== action.payload);
    case EDIT_AD:
      return statePart.map((ad) =>
        ad._id === action.payload._id ? action.payload : ad
      );
    case UPDATE_ADS:
      return [...action.payload.ads];
    default:
      return statePart;
  }
};

export default adsReducer;
