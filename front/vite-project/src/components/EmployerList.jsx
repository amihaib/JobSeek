import React, { useState } from 'react';
import EmployerCard from './EmployerCard.jsx';
import { Outlet, useLocation } from 'react-router-dom';

const employers = [
    {
    id: 1,
    companyName: "TechCorp",
    companyLogo: "https://via.placeholder.com/100",
    numberOfEmployees: 150,
    companyDetails: "A leading tech company specializing in software development.",
    companyLocation: { lat: 40.7128, lng: -74.0060 },
    averageRating: 4,
    companyJobPosts: [
      { id: 1, title: "Software Engineer", description: "Develop and maintain software applications." },
      { id: 2, title: "Product Manager", description: "Lead product development and strategy." },
      { id: 3, title: "UI/UX Designer", description: "Design user interfaces and improve user experience." },
      { id: 4, title: "Data Scientist", description: "Analyze data and build predictive models." },
      { id: 5, title: "DevOps Engineer", description: "Manage infrastructure and deployment pipelines." },
    ],
    userComments: [
      { username: "JohnDoe", date: "2023-09-10", text: "Great place to work with lots of opportunities." },
      { username: "JaneSmith", date: "2023-08-21", text: "Supportive team and good work-life balance." },
      { username: "SamWilson", date: "2023-07-15", text: "Competitive salary and benefits." },
      { username: "ChrisEvans", date: "2023-06-20", text: "Challenging projects and good growth opportunities." },
      { username: "EmilyBrown", date: "2023-05-10", text: "Friendly environment and lots of innovative projects to work on." },
    ],
  },
  
    {

    id: 2,
    companyName: "Tech Innovators",
    companyLogo: "https://via.placeholder.com/100",
    numberOfEmployees: 250,
    companyDetails: "A leading tech company specializing in innovative solutions.",
    companyLocation: { lat: 34.0522, lng: -118.2437 },
    companyJobPosts: [
      { id: 1, title: "Frontend Developer", description: "Develop amazing user interfaces." },
      { id: 2, title: "Backend Developer", description: "Build robust backend systems." },
      { id: 3, title: "Full Stack Developer", description: "Work on both frontend and backend." },
      { id: 4, title: "Product Manager", description: "Manage product development cycles." },
    ],
    averageRating: 4,
    userComments: [
      {
        username: "JohnDoe",
        date: "2023-09-12",
        text: "Great company to work for! The team is supportive and the projects are exciting.",
      },
      {
        username: "JaneSmith",
        date: "2023-08-10",
        text: "The work-life balance is fantastic. Highly recommend for tech enthusiasts.",
      },
      {
        username: "MikeBrown",
        date: "2023-07-25",
        text: "Learning opportunities are abundant. A perfect place to grow your career.",
      },
      {
        username: "AliceGreen",
        date: "2023-06-14",
        text: "Friendly environment and lots of innovative projects to work on.",
      },
    ],
    },
  
  
    
  {
    id: 3,
    companyName: "HealthCare Corp.",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 300,
    companyDetails: "Providing top-notch healthcare services and products globally.",
    companyLocation: { lat: 31.7683, lng: 35.2137 }, // Jerusalem, Israel
    companyJobPosts: [
      { id: 1, title: "Nurse", description: "Provide patient care and support." },
      { id: 2, title: "Healthcare Administrator", description: "Manage healthcare facilities and services." }
    ],
    averageRating: 5
  },
  {
    id: 4,
    companyName: "Green Energy Solutions",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 80,
    companyDetails: "Specializing in renewable energy solutions and sustainability projects.",
    companyLocation: { lat: 32.7940, lng: 34.9896 }, // Haifa, Israel
    companyJobPosts: [
      { id: 1, title: "Project Manager", description: "Lead renewable energy projects." },
      { id: 2, title: "Energy Analyst", description: "Analyze energy consumption and suggest improvements." }
    ],
    averageRating: 3
  },
  {
    id: 5,
    companyName: "EduTech Enterprises",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 150,
    companyDetails: "Innovative educational technologies for modern learning environments.",
    companyLocation: { lat: 32.0853, lng: 34.7818 }, // Tel Aviv, Israel
    companyJobPosts: [
      { id: 1, title: "Curriculum Developer", description: "Develop educational content and materials." },
      { id: 2, title: "Tech Support Specialist", description: "Provide technical support for educational products." }
    ],
    averageRating: 4
  },
  {
    id: 6,
    companyName: "Global Finance Group",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 200,
    companyDetails: "Providing financial services and investment solutions worldwide.",
    companyLocation: { lat: 32.0684, lng: 34.8248 }, // Herzliya, Israel
    companyJobPosts: [
      { id: 1, title: "Financial Analyst", description: "Analyze financial data and market trends." },
      { id: 2, title: "Investment Manager", description: "Manage investment portfolios and strategies." }
    ],
    averageRating: 5
  },
  {
    id: 7,
    companyName: "Retail Giants Ltd.",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 500,
    companyDetails: "Leading retail company with a wide range of consumer products.",
    companyLocation: { lat: 31.2518, lng: 34.7913 }, // Beersheba, Israel
    companyJobPosts: [
      { id: 1, title: "Store Manager", description: "Oversee daily operations of retail stores." },
      { id: 2, title: "Sales Associate", description: "Assist customers and drive sales." }
    ],
    averageRating: 4
  },
  {
    id: 8,
    companyName: "Creative Media Agency",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 100,
    companyDetails: "Full-service media agency specializing in advertising and marketing.",
    companyLocation: { lat: 32.1793, lng: 34.9078 }, // Netanya, Israel
    companyJobPosts: [
      { id: 1, title: "Graphic Designer", description: "Create visual content for various media." },
      { id: 2, title: "Marketing Coordinator", description: "Plan and execute marketing campaigns." }
    ],
    averageRating: 3
  },
  {
    id: 9,
    companyName: "Logistics & Supply Co.",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 250,
    companyDetails: "Efficient logistics and supply chain management solutions.",
    companyLocation: { lat: 32.0145, lng: 34.7741 }, // Rishon LeZion, Israel
    companyJobPosts: [
      { id: 1, title: "Logistics Coordinator", description: "Coordinate logistics and supply chain activities." },
      { id: 2, title: "Warehouse Manager", description: "Manage warehouse operations and staff." }
    ],
    averageRating: 4
  },
  {
    id: 10,
    companyName: "Tech Startups Hub",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 50,
    companyDetails: "Incubating and accelerating innovative tech startups.",
    companyLocation: { lat: 31.7683, lng: 35.2137 }, // Jerusalem, Israel
    companyJobPosts: [
      { id: 1, title: "Startup Mentor", description: "Mentor and guide startup founders." },
      { id: 2, title: "Venture Capital Analyst", description: "Evaluate and invest in startup ventures." }
    ],
    averageRating: 5
  },

  {
    id: 11,
    companyName: "Tech Innovators Ltd.",
    companyLogo: "https://via.placeholder.com/150",
    numberOfEmployees: 120,
    companyDetails: "Leading tech solutions provider specializing in innovative software development.",
    companyLocation: { lat: 32.0853, lng: 34.7818 }, // Tel Aviv, Israel
    companyJobPosts: [
      { id: 1, title: "Software Engineer", description: "Develop and maintain software applications." },
      { id: 2, title: "Product Manager", description: "Oversee product development from concept to launch." }
    ],
    averageRating: 4
  
  }

];

const employersPerPage = 9;

const EmployerList = () => {

  const location = useLocation()
  const isMainRoute = location.pathname === "/employer-page"
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastEmployer = currentPage * employersPerPage;
  const indexOfFirstEmployer = indexOfLastEmployer - employersPerPage;
  const currentEmployers = employers.slice(indexOfFirstEmployer, indexOfLastEmployer);

  const totalPages = Math.ceil(employers.length / employersPerPage);

console.log("");

  return (
    <> 
    <Outlet/>
    
    {isMainRoute && (<div className="container mx-auto p-4">
      <div className="flex flex-wrap -mx-2">
        {currentEmployers.map((employer) => (
          <EmployerCard key={employer.id} employer={employer} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded-lg ${
              currentPage === index + 1 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>)}
    </>
  );
};

export default EmployerList;
