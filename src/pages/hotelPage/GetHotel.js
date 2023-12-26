import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/authContext";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import './getHotel.css'

const GetHotel = () => {
  const pictureAddress = "http://localhost:4000/hotelsPictures/"
  const runOnce = useRef(false);
  const [loading, setLoading] = useState(true);
  const [hotelToDisplay, setHotelToDisplay] = useState();
  const location = useLocation();
  const { hotel_id } = useParams();
  // const hotelToDisplay = location?.state;
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  useEffect(() => {
    if (runOnce.current === false) {
      const displayHotel = async () => {
        setLoading(true);
        try {
          if (location.state) {
            setHotelToDisplay(location.state);
          } else {
            const resp = await axiosWithInterceptors.get(`/hotels/${hotel_id}`);
            console.log("resp.data.data: ", resp.data.data);
            setHotelToDisplay(resp.data.data);
          }
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      displayHotel();
    }

    return () => {
      runOnce.current = true;
    };
  }, []);

  const deleteThisHotel = async () => {
    try {
      await axiosWithInterceptors.delete(`/hotels/${hotelToDisplay._id}`);
      navigate("/hotels");
    } catch (err) {
      console.log(err);
    }
  };

  const updateThisHotel = () => {
    navigate("/hotels/updatehotel", { state: hotelToDisplay._id });
  };

  const updateHotelPhoto = () => {
    // Specify the types of files, the size limit in MB, and whether its a single or multiple files
    const fileOptions = {
      types: [".jpg"],
      sizeLimit: 5,
      number: "single",
      code: "hotelphoto",
      id: hotel_id,
    };
    navigate("/uploadfiles", { state: fileOptions });
  };

  return (
    <div>
      {loading ? (
        <p>Loading !!!</p>
      ) : (
        <>
          <div className="getHotelImgContainer">
            <img
              src={pictureAddress + `${hotelToDisplay._id}/${hotelToDisplay.photos}`}
              alt=""
              className="getHotelImg"
              width="250"
              height="250"
            />
          </div>
          <p>Hotel id: {hotelToDisplay._id}</p>
          <p>Hotel name: <span style={{"text-transform": "capitalize"}}><strong>{hotelToDisplay.name}</strong></span></p>
          <p>Hotel address: <span style={{"text-transform": "capitalize"}}>{hotelToDisplay.hotelLocation.address}</span></p>
          <p>Hotel city: <span style={{"text-transform": "capitalize"}}>{hotelToDisplay.city}</span></p>
          <p>hotel type: <span style={{"text-transform": "capitalize"}}>{hotelToDisplay.type}</span></p>
          <p>hotel description: {hotelToDisplay.description}</p>
          <p>Ratings: <strong>{hotelToDisplay.ratingsAverage}</strong></p>
          <p>Number of ratings: {hotelToDisplay.numberOfRatings}</p>
          <p>Hotel Manager: <span style={{"text-transform": "capitalize"}}>{hotelToDisplay.manager?.name}</span></p>
          {hotelToDisplay.staff?.map((staff) => (
            <div key={staff._id}>
              <br />
              <p>Staff name: <span style={{"text-transform": "capitalize"}}>{staff.name}</span></p>
            </div>
          ))}
          {hotelToDisplay.room_ids?.map((roomStyle) => (
            <div key={roomStyle._id}>
              <br />
              <p>Room style: <span style={{"text-transform": "capitalize"}}>{roomStyle.title}</span></p>
              <p>Room price: ${roomStyle.price}</p>
              <p>Room description: {roomStyle.description}</p>
            </div>
          ))}
          <br />

          {auth.assignedRoles == 2030 && (
            <>
              <button
                onClick={() => {
                  updateThisHotel();
                }}
                style={{ padding: "5px" }}
              >
                Update hotel information
              </button>
              <br />
              <button
                onClick={() => {
                  updateHotelPhoto();
                }}
                style={{ marginTop: "5px" }}
              >
                Update hotel photo
              </button>
              <br />
              <button
                onClick={() => {
                  deleteThisHotel();
                }}
                style={{ marginTop: "5px" }}
              >
                Delete hotel
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GetHotel;