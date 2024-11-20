import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmployerCard = ({ employer }) => {
  const {
    id,
    companyName,
    companyLogo,
    numberOfEmployees,
  } = employer;

 const navigate= useNavigate();
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 mx-2 w-1/3">
      <img src={companyLogo} alt={companyName} className="w-24 h-24 rounded-full mx-auto" />
      <h3 className="text-xl font-bold mt-2 text-center text-orange-600">{companyName}</h3>
      <p className="text-center text-gray-700">{numberOfEmployees} עובדים בחברה</p>
      {/* <Link to={`/employer/${id}`} className="block mt-4 px-4 py-2 bg-orange-500 text-white text-center rounded-lg">
        פרטים נוספים
      </Link> */}
      <button className="block mt-4 px-4 py-2 bg-orange-500 text-white text-center rounded-lg" onClick={()=>{
        navigate(`${id}`,{state:{employer}})
      }}> 
        פרטים נוספים
      </button>
    </div>
  );
};

export default EmployerCard;
