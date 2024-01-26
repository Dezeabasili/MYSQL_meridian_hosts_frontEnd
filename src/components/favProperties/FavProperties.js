import "./favProperties.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useWindowSize from "../../hooks/useWindowSize";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";

const FavProperties = () => {
  const [hotelsData, setHotelsData] = useState([]);
  const [hotelsToDisplay, setHotelsToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const screenSize = useWindowSize();
  const ref = useRef();
  const runOnce = useRef(false);
  ref.current = screenSize.width;

  useEffect(() => {
    if (runOnce.current === false) {
      const loadPage = async () => {
        setLoading(true);
        try {
          const resp = await axios.get(
            baseURL + "api/v1/hotels?sort=-ratingsAverage&limit=4"
          );

          setHotelsData([...resp.data.data]);

          if (ref.current <= 600) {
            setHotelsToDisplay((prev) => {
              prev = [...resp.data.data];
              prev?.pop();
              prev?.pop();

              return [...prev];
            });
          } else if (ref.current <= 900) {
            setHotelsToDisplay((prev) => {
              prev = [...resp.data.data];
              prev?.pop();
              return [...prev];
            });
          } else setHotelsToDisplay([...resp.data.data]);

          setLoading(false);
        } catch (err) {
          if (err.response.data.message) {
            navigate("/handleerror", {
              state: {
                message: err.response.data.message,
                path: location.pathname,
              },
            });
          } else {
            navigate("/somethingwentwrong");
          }
        }
      };

      loadPage();
    }

    return () => {
      runOnce.current = true;
    };
  }, []);

  useEffect(() => {
    if (screenSize.width <= 600) {
      setHotelsToDisplay((prev) => {
        prev = [...hotelsData];
        prev?.pop();
        prev?.pop();
        return [...prev];
      });
    } else if (screenSize.width <= 900) {
      setHotelsToDisplay((prev) => {
        prev = [...hotelsData];
        prev?.pop();
        return [...prev];
      });
    } else setHotelsToDisplay([...hotelsData]);
  }, [screenSize.width]);

  return (
    <div className="fPContainer">
      <>
        {loading && (
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
        )}
      </>

      <>
        {!loading && (
          <>
            <h3 className="fPContainerTitle">Homes guests love</h3>
            <div className="fPList">
              {hotelsToDisplay?.map((hotel, index) => {
                return (
                  <div className="favProperty" key={hotel._id}>
                    <div className="favPropertyDiv1">
                      <img
                        src={hotel.photos}
                        alt=""
                        className="fPImg"
                        width="150"
                        height="150"
                      />
                      <h4 className="fPName">{hotel.name}</h4>
                      <p className="fPDesc">{hotel.description}</p>
                      <p className="fPPrice">
                        Starting from ${hotel.cheapestPrice}
                      </p>
                    </div>

                    <div className="fPStats">
                      <button className="fPRating">
                        Rating: {hotel.ratingsAverage}
                      </button>
                      <span className="fPReviews nowrap">
                        {hotel.numberOfRatings}{" "}
                        {hotel.numberOfRatings == 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default FavProperties;
