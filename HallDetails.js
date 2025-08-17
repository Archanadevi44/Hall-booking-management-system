import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./HallDetails.css";

const HallDetails = () => {
  const { id } = useParams();  // Extract hall id from URL
  const navigate = useNavigate();

  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "";

  const availableServices = [
    { name: "Catering", price: 5000 },
    { name: "Decoration", price: 3000 },
    { name: "Sound System", price: 2000 },
    { name: "DJ Service", price: 4000 },
  ];

  // Fetch hall details on component mount
  useEffect(() => {
    const fetchHall = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/halls/${id}`);
        setHall(res.data);
        console.log("Hall ID:", res.data._id);  // Log the hall ID
      } catch (err) {
        setError("Failed to fetch hall details.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  // Check availability and calculate total price when dates or services change
  useEffect(() => {
    const checkAvailability = async (startDate, endDate) => {
      try {
        const res = await axios.post("http://localhost:5000/api/booking/check", {
          hallId: hall._id,
          startDate,
          endDate,
        });
        setIsAvailable(res.data.isAvailable);
      } catch (err) {
        console.error("Error checking availability:", err);
        setIsAvailable(false);
      }
    };

    if (hall && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end > start) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const hallCost = days * hall.price;
        const serviceCost = selectedServices.reduce((sum, s) => sum + s.price, 0);
        setTotalPrice(hallCost + serviceCost);

        checkAvailability(start.toISOString(), end.toISOString());
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, hall, selectedServices]);

  const handleServiceChange = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.name === service.name)
        ? prev.filter((s) => s.name !== service.name)
        : [...prev, service]
    );
  };

  const handleBooking = async () => {
    if (!userName) {
      // Save the entire booking data before redirecting to login
      const bookingData = {
        hallId: hall._id,
        hallName: hall.name,
        startDate,
        endDate,
        services: selectedServices,
        totalPrice,
      };
  
      localStorage.setItem("redirectToHallId", id);  // Save hall ID for redirect
      localStorage.setItem("bookingData", JSON.stringify(bookingData));  // Save full booking data
  
      navigate("/login", { state: { fromHallId: id } });  // Redirect to login page
      return;
    }
  
    if (!hall || !startDate || !endDate) {
      setError("Missing booking details.");
      return;
    }
  
    if (!isAvailable) {
      setError("The hall is unavailable for the selected dates.");
      return;
    }
  
    try {
      setBooking(true);
  
      const bookingData = {
        hallId: hall._id,
        hallName: hall.name,
        startDate,
        endDate,
        services: selectedServices,
        totalPrice,
        userName,
      };
  
      const response = await axios.post("http://localhost:5000/api/booking", bookingData);

      localStorage.setItem("bookingConfirmation", JSON.stringify(response.data));

      localStorage.removeItem("user"); 

      await axios.put(`http://localhost:5000/api/halls/updateAvailability/${hall._id}`, { isAvailable: false });

      navigate("/summary", { replace: true });
    } catch (err) {
      console.error("Booking failed", err);
      if (err.response) {
        setError(`Error: ${err.response.data.message || "An error occurred while processing the booking."}`);
      } else {
        setError("An error occurred while processing the booking.");
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="hall-details-container">
      <img src={hall.imageUrl} alt={hall.name} className="hall-image" />
      <div className="mt-6">
        <h1 className="hall-name">{hall.name}</h1>
        <p className="hall-location">{hall.location}</p>

        <div className="hall-info">
          <span>⭐ {hall.rating} Rating</span>
          <span>🚗 {hall.carParking} Car Parking</span>
          <span>🏛️ {hall.capacity} Capacity</span>
        </div>

        <h2 className="hall-price">₹{hall.price} / Day</h2>

        <div className="mt-8">
          <h3 className="select-date-title">Select Booking Dates</h3>

          <div className="date-picker">
            <label>Start Date: </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="date-picker">
            <label>End Date: </label>
            <input
              type="date"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>

          {startDate && endDate && new Date(endDate) > new Date(startDate) && (
            <>
              <p className="selected-dates">
                From <strong>{startDate}</strong> to <strong>{endDate}</strong>
              </p>
              <p className="total-price">Total Price: ₹{totalPrice}</p>
            </>
          )}

          <h3 className="select-services-title">Select Optional Services</h3>
          <div className="optional-services">
            {availableServices.map((service) => (
              <div key={service.name} className="service-option">
                <input
                  type="checkbox"
                  id={service.name}
                  onChange={() => handleServiceChange(service)}
                />
                <label htmlFor={service.name}>
                  {service.name} (+₹{service.price})
                </label>
              </div>
            ))}
          </div>

          {isAvailable ? (
            <button
              onClick={handleBooking}
              disabled={booking || !startDate || !endDate || new Date(startDate) >= new Date(endDate)}
              className="book-now-button"
            >
              {booking ? "Processing..." : "Book Now"}
            </button>
          ) : (
            <p className="unavailable-text">
              This hall is unavailable for the selected dates.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallDetails;
