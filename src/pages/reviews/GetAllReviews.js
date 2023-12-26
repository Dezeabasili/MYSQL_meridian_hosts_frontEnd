import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";

const GetAllReviews = () => {
  const [reviewsList, setReviewsList] = useState();
  const [loading, setLoading] = useState(true);
  const runOnce = useRef(false)
  const navigate = useNavigate();
  const location = useLocation();
  const axiosWithInterceptors = useAxiosInterceptors();

  useEffect(() => {
    if (runOnce.current === false) {
      const reviews = async () => {
        setLoading(true);
        try {
          if (location.state) {
            setReviewsList(location.state);
          } else {
            const resp = await axiosWithInterceptors.get("/reviews");
            console.log("reviews: ", resp.data.data);
            setReviewsList([...resp.data.data]);
          }
  
          setLoading(false);
        } catch (err) {
          console.log(err.message);
        }
      };
  
      reviews();

    }
    return () => {
      runOnce.current = true
    }

  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading !!!</p>
      ) : (
        <>
          {reviewsList.length > 0 ? (
            <>
              {reviewsList?.map((review) => (
                <div key={review._id}>
                  <p>Hotel name: <span style={{"text-transform": "capitalize"}}>{review.hotel.name}</span></p>
                  <p>Customer name: <span style={{"text-transform": "capitalize"}}>{review.customer.name}</span></p>
                  <p>Review date: {format(new Date(review.createdAt), "MMM/dd/yyyy,  hh:mm:ss bbb")}</p>
                  <p>Review: {review.review}</p>
                  <p>Rating: {review.rating}</p>
                  <br />
                  <br />
                </div>
              ))}
            </>
          ) : (
            <p>No review in the database !!!</p>
          )}
        </>
      )}
    </div>
  );
};

export default GetAllReviews;