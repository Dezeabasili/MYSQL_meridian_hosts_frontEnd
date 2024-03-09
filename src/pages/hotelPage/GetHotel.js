import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/authContext";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import "./getHotel.css";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const GetHotel = () => {
  const runOnce = useRef(false);
  const starsToDisplay = useRef({});
  const [loading, setLoading] = useState(true);
  const [hotelToDisplay, setHotelToDisplay] = useState();
  const location = useLocation();
  const { hotel_id } = useParams();

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
            starsToDisplay.current.yellowStars = Math.trunc(
              location.state.ratingsAverage
            );
            starsToDisplay.current.whiteStars = Math.trunc(
              5 - location.state.ratingsAverage
            );
            starsToDisplay.current.halfStars =
              5 -
              starsToDisplay.current.yellowStars -
              starsToDisplay.current.whiteStars;
          } else {
            const resp = await axiosWithInterceptors.get(`/hotels/${hotel_id}`);
            // console.log("resp.data.data: ", resp.data.data);
            setHotelToDisplay(resp.data.data);
            starsToDisplay.current.yellowStars = Math.trunc(
              resp.data.data.ratingsAverage
            );
            starsToDisplay.current.whiteStars = Math.trunc(
              5 - resp.data.data.ratingsAverage
            );
            starsToDisplay.current.halfStars =
              5 -
              starsToDisplay.current.yellowStars -
              starsToDisplay.current.whiteStars;
          }
          setLoading(false);
        } catch (err) {
          if (err.response.data.message) {
            navigate('/handleerror', {state: {message: err.response?.data?.message, path: location.pathname}})
          } else {
            navigate('/somethingwentwrong')
          }
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
      await axiosWithInterceptors.delete(`/hotels/${hotelToDisplay.id_hotels}`);
      navigate("/");
    } catch (err) {
      if (err.response.data.message) {
        navigate('/handleerror', {state: {message: err.response?.data?.message, path: location.pathname}})
      } else {
        navigate('/somethingwentwrong')
      }
    }
  };

  const updateThisHotel = () => {
    navigate("/hotels/updatehotel", { state: hotelToDisplay.id_hotels });
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
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        <>
          <div className="getHotelImgContainer">
            <img
              src={hotelToDisplay.photos}
              alt=""
              className="getHotelImg"
              width="250"
              height="250"
            />
          </div>
          <p>Hotel id: {hotelToDisplay.id_hotels}</p>
          <p>
            Hotel name:{" "}
            <span style={{ textTransform: "capitalize" }}>
              <strong>{hotelToDisplay.name}</strong>
            </span>
          </p>
          <p>
            Hotel address:{" "}
            <span style={{ textTransform: "capitalize" }}>
              {hotelToDisplay?.hotelLocation?.address}
            </span>
          </p>
          <p>
            Hotel city:{" "}
            <span style={{ textTransform: "capitalize" }}>
              {hotelToDisplay.cityName}
            </span>
          </p>
          <p>
            Hotel type:{" "}
            <span style={{ textTransform: "capitalize" }}>
              {hotelToDisplay.hotelType}
            </span>
          </p>
          <p>Hotel description: {hotelToDisplay.description}</p>
          <p>Hotel detailed description: {hotelToDisplay.detailedDescription}</p>
          <div>
            <span>Rating: </span>

            {[...Array(starsToDisplay.current.yellowStars)].map((star, i) => (
              <FontAwesomeIcon
                icon={faStar}
                size="sm"
                className="fStar"
                key={i}
              />
            ))}

            {[...Array(starsToDisplay.current.halfStars)].map((star, i) => (
              <FontAwesomeIcon
                icon={faStarHalfStroke}
                size="sm"
                className="fStar"
                key={i}
              />
            ))}

            {[...Array(starsToDisplay.current.whiteStars)].map((star, i) => (
              <FontAwesomeIcon
                icon={faStar}
                size="sm"
                className="fStarHover"
                key={i}
              />
            ))}
          </div>

          <p>Number of ratings: {hotelToDisplay.numberOfRatings}</p>
          <p>
            Hotel Manager:{" "}
            <span style={{ textTransform: "capitalize" }}>
              {hotelToDisplay.manager?.name}
            </span>
          </p>
          {hotelToDisplay.staff?.map((staff) => (
            <div key={staff._id}>
              <br />
              <p>
                Staff name:{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {staff.name}
                </span>
              </p>
            </div>
          ))}
          {hotelToDisplay.room_ids?.map((roomStyle) => (
            <div key={roomStyle._id}>
              <br />
              <p>
                Room style:{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {roomStyle.title}
                </span>
              </p>
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
