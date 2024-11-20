import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const BackArrow = ({ color = "grey-700", url }) => {
  const navigate = useNavigate();
  return (
    <FaArrowLeft
      className={`text-${color} cursor-pointer`}
      size={30}
      onClick={() => navigate(url)} // Navigate back to profile
    />
  );
};

export default BackArrow;
