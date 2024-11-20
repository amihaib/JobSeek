// import React, { useState } from 'react';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import MyDocument from './MyDocument.jsx';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import Select from 'react-select';
// import 'tailwindcss/tailwind.css';
// import iso6391 from 'iso-639-1';

// const ResumeBuilder = () => {
//   const [data, setData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     linkedin: '',
//     socialMedia: '',
//     summary: '',
//     experience: [],
//     education: [],
//     skills: [],
//     languages: [],
//     projects: [],
//   });

//   const handleChange = (e, type = null, index = null, key = null) => {
//     if (type) {
//       const newData = { ...data };
//       newData[type][index][key] = e.target.value;
//       setData(newData);
//     } else {
//       setData({ ...data, [e.target.name]: e.target.value });
//     }
//   };

//   const handleMultiSelectChange = (selectedOptions) => {
//     setData({ ...data, languages: selectedOptions });
//   };

//   const addField = (field) => () => {
//     setData({ ...data, [field]: [...data[field], ''] });
//   };

//   const removeField = (field, index) => () => {
//     setData({
//       ...data,
//       [field]: data[field].filter((_, i) => i !== index),
//     });
//   };

//   const handleAddExperience = () => {
//     const newExperience = {
//       position: '',
//       company: '',
//       startDate: '',
//       endDate: '',
//       description: '',
//       current: false,
//     };
//     setData({ ...data, experience: [...data.experience, newExperience] });
//   };

//   const handleAddEducation = () => {
//     const newEducation = {
//       degree: '',
//       school: '',
//       startDate: '',
//       endDate: '',
//       description: '',
//     };
//     setData({ ...data, education: [...data.education, newEducation] });
//   };

//   const handleFieldChange = (field, index) => (event) => {
//     const newFields = data[field].map((item, i) => (i === index ? event.target.value : item));
//     setData({ ...data, [field]: newFields });
//   };

//   const handleAddProject = () => {
//     const newProject = {
//       title: '',
//       description: '',
//       link: '',
//     };
//     setData({ ...data, projects: [...data.projects, newProject] });

// //    const handlSaveResumeOnSite = () => {
// //     console.log("נשמר באתר");
  
// //     setData({ ...data,  });

// //    };
//   };

//   return (
//     <div className="p-4 max-w-screen-md mx-auto bg-white shadow-md">
//       <h1 className="text-2xl font-bold mb-4 text-orange-500">יצירת קורות חיים</h1>

//       <label className="block text-gray-500">שם מלא:</label>
//       <input
//         type="text"
//         className="w-full p-2 border border-gray-500 rounded mb-4"
//         name="name"
//         value={data.name}
//         onChange={handleChange}
//         required
//       />

//       <label className="block text-gray-500">דוא"ל:</label>
//       <input
//         type="email"
//         className="w-full p-2 border border-gray-500 rounded mb-4"
//         name="email"
//         value={data.email}
//         onChange={handleChange}
//         required
//       />

//       <label className="block text-gray-500">טלפון:</label>
//       <PhoneInput
//         country={'il'}
//         value={data.phone}
//         onChange={(phone) => setData({ ...data, phone })}
//         className="mb-4"
//       />

//       <label className="block text-gray-500 mt-4">שפות:</label>
//       <Select
//         isMulti
//         name="languages"
//         options={iso6391.getAllCodes().map((code) => ({ value: code, label: iso6391.getName(code) }))}
//         className="basic-multi-select"
//         classNamePrefix="select"
//         onChange={handleMultiSelectChange}
//         value={data.languages}
//       />

//       <label className="block text-gray-500">תקציר מקדים:</label>
//       <textarea
//         className="w-full p-2 border border-gray-500 rounded mb-4"
//         name="summary"
//         value={data.summary}
//         onChange={handleChange}
//       ></textarea>

//       <label className="block text-gray-500">קישורים:</label>
//       <input
//         type="url"
//         placeholder="LinkedIn"
//         className="w-full p-2 border border-gray-500 rounded mb-2"
//         name="linkedin"
//         value={data.linkedin}
//         onChange={handleChange}
//       />
//       <input
//         type="url"
//         placeholder="Social Media"
//         className="w-full p-2 border border-gray-500 rounded mb-4"
//         name="socialMedia"
//         value={data.socialMedia}
//         onChange={handleChange}
//       />

//       {/* ---------------------------------------- כישורים--------------------------------------------------------------------*/}
//       <label className="block text-gray-500">כישורים:</label>
//       {data.skills.map((skill, index) => (
//         <div key={index} className="flex items-center mb-2">
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-500 rounded"
//             value={skill}
//             onChange={handleFieldChange('skills', index)}
//           />
//           <button onClick={removeField('skills', index)} className="ml-2 text-orange-400">
//             X
//           </button>
//         </div>
//       ))}
//       <button onClick={addField('skills')} className="bg-gray-500 text-white p-2 rounded mb-4">
//         הוסף כישור
//       </button>

//       {/* ------------------------------------------- השכלה ---------------------------------------------------*/}
//       <h3 className="text-xl font-bold mt-6 text-orange-500">השכלה</h3>
//       {data.education.map((edu, index) => (
//         <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
//           <button
//             onClick={removeField('education', index)}
//             className="absolute top-0 left-0 m-2 p-1 bg-orange-400 text-white rounded-full hover:bg-gray-500"
//           >
//             X
//           </button>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="block mb-2 font-semibold">תואר:</label>
//               <input
//                 type="text"
//                 value={edu.degree}
//                 onChange={(e) => handleChange(e, 'education', index, 'degree')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">מוסד לימודים:</label>
//               <input
//                 type="text"
//                 value={edu.school}
//                 onChange={(e) => handleChange(e, 'education', index, 'school')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">תאריך התחלה:</label>
//               <input
//                 type="date"
//                 value={edu.startDate}
//                 onChange={(e) => handleChange(e, 'education', index, 'startDate')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">תאריך סיום:</label>
//               <input
//                 type="date"
//                 value={edu.endDate}
//                 onChange={(e) => handleChange(e, 'education', index, 'endDate')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div className="col-span-2">
//               <label className="block mb-2 font-semibold">תיאור:</label>
//               <textarea
//                 value={edu.description}
//                 onChange={(e) => handleChange(e, 'education', index, 'description')}
//                 className="w-full p-2 border rounded-md"
//               ></textarea>
//             </div>
//           </div>
//         </div>
//       ))}
//       <button onClick={handleAddEducation} className="block w-full p-2 bg-orange-400 text-white rounded-md hover:bg-gray-500">
//         הוסף השכלה
//       </button>
      
//       {/*--------------------------------- ניסיון תעסוקתי ----------------------------------------------------*/}
//       <h3 className="text-xl font-bold mt-6 text-orange-500">ניסיון תעסוקתי</h3>
//       {data.experience.map((exp, index) => (
//         <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
//           <button
//             onClick={removeField('experience', index)}
//             className="absolute top-0 left-0 m-2 p-1 bg-orange-400 text-white rounded-full hover:bg-gray-500"
//           >
//             X
//           </button>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="block mb-2 font-semibold">תפקיד:</label>
//               <input
//                 type="text"
//                 value={exp.position}
//                 onChange={(e) => handleChange(e, 'experience', index, 'position')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">חברה:</label>
//               <input
//                 type="text"
//                 value={exp.company}
//                 onChange={(e) => handleChange(e, 'experience', index, 'company')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">תאריך התחלה:</label>
//               <input
//                 type="date"
//                 value={exp.startDate}
//                 onChange={(e) => handleChange(e, 'experience', index, 'startDate')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">תאריך סיום:</label>
//               <input
//                 type="date"
//                 value={exp.endDate}
//                 onChange={(e) => handleChange(e, 'experience', index, 'endDate')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={exp.current}
//                 onChange={(e) => handleChange({ target: { value: e.target.checked } }, 'experience', index, 'current')}
//               />
//               <label className="block mb-2 font-semibold ml-2">עדיין עובד כאן</label>
//             </div>
//             <div className="col-span-2">
//               <label className="block mb-2 font-semibold">תיאור:</label>
//               <textarea
//                 value={exp.description}
//                 onChange={(e) => handleChange(e, 'experience', index, 'description')}
//                 className="w-full p-2 border rounded-md"
//               ></textarea>
//             </div>
//           </div>
//         </div>
//       ))}
//       <button onClick={handleAddExperience} className="block w-full p-2 bg-orange-400 text-white rounded-md hover:bg-gray-500">
//         הוסף ניסיון תעסוקתי
//       </button>

//       {/* ----------------------------------------- פרויקטים------------------------------------------------------*/}
//       <h3 className="text-xl font-bold mt-6 text-orange-500">פרויקטים</h3>
//       {data.projects.map((project, index) => (
//         <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
//           <button
//             onClick={removeField('projects', index)}
//             className="absolute top-0 left-0 m-2 p-1 bg-orange-400 text-white rounded-full hover:bg-gray-500"
//           >
//             X
//           </button>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="block mb-2 font-semibold">שם הפרויקט:</label>
//               <input
//                 type="text"
//                 value={project.title}
//                 onChange={(e) => handleChange(e, 'projects', index, 'title')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">תיאור:</label>
//               <input
//                 type="text"
//                 value={project.description}
//                 onChange={(e) => handleChange(e, 'projects', index, 'description')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 font-semibold">קישור:</label>
//               <input
//                 type="url"
//                 value={project.link}
//                 onChange={(e) => handleChange(e, 'projects', index, 'link')}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//       <button onClick={handleAddProject} className="block w-full p-2 bg-orange-400 text-white rounded-md hover:bg-gray-500">
//         הוסף פרויקט
//       </button>

//       {/* -------------------------------------שמירה והעלאה ----------------------------- */}
//       <div>
//         <PDFDownloadLink
//             document={<MyDocument data={data} />}
//             fileName="resume.pdf"
//             className="block mt-8 p-2 bg-gray-500 text-white rounded-md hover:bg-orange-400 text-center"
//         >
//             {({ blob, url, loading, error }) => (loading ? 'טוען...' : 'הורד קובץ PDF')}
//         </PDFDownloadLink>

//         <button className="block mt-8 p-2 bg-orange-500 text-white rounded-md hover:bg-gray-500">
//             שמור באתר
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ResumeBuilder;

import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import iso6391 from 'iso-639-1';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss/tailwind.css';

const ResumeBuilder = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    socialMedia: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
  });

  const handleChange = (e, type = null, index = null, key = null) => {
    if (type) {
      const newData = { ...data };
      newData[type][index][key] = e.target.value;
      setData(newData);
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setData({ ...data, languages: selectedOptions });
  };

  const addField = (field) => () => {
    setData({ ...data, [field]: [...data[field], ''] });
  };

  const removeField = (field, index) => () => {
    setData({
      ...data,
      [field]: data[field].filter((_, i) => i !== index),
    });
  };

  const handleAddExperience = () => {
    const newExperience = {
      position: '',
      company: '',
      startDate: null,
      endDate: null,
      description: '',
      current: false,
    };
    setData({ ...data, experience: [...data.experience, newExperience] });
  };

  const handleAddEducation = () => {
    const newEducation = {
      degree: '',
      school: '',
      startDate: null,
      endDate: null,
      description: '',
      current: false,
    };
    setData({ ...data, education: [...data.education, newEducation] });
  };

  const handleFieldChange = (field, index) => (event) => {
    const newFields = data[field].map((item, i) => (i === index ? event.target.value : item));
    setData({ ...data, [field]: newFields });
  };

  const handleDateChange = (field, index, key, date) => {
    const newFields = data[field].map((item, i) => (i === index ? { ...item, [key]: date } : item));
    setData({ ...data, [field]: newFields });
  };

  const handleAddProject = () => {
    const newProject = {
      title: '',
      description: '',
      link: '',
    };
    setData({ ...data, projects: [...data.projects, newProject] });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateURL = (url) => {
    const re = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
    return re.test(String(url).toLowerCase());
  };

  const generateDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              direction: "rtl",
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: data.name,
                  bold: true,
                  size: 24,
                  color: "FF6600",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `דוא"ל: ${data.email}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `טלפון: ${data.phone}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'ניסיון תעסוקתי',
                  bold: true,
                  color: "FF6600",
                  size: 20,
                }),
              ],
            }),
            ...data.experience.map((exp) => (
              new Paragraph({
                children: [
                  new TextRun({
                    text: `משרה: ${exp.position}, חברה: ${exp.company}, ${exp.startDate ? `תאריך התחלה: ${exp.startDate.toLocaleDateString()}` : ''}${exp.endDate ? `, תאריך סיום: ${exp.endDate.toLocaleDateString()}` : ''}${exp.current ? ', עדיין עובד כאן' : ''}`,
                  }),
                  new TextRun({
                    text: `\nתיאור: ${exp.description}`,
                  }),
                ],
              })
            )),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'השכלה',
                  bold: true,
                  color: "FF6600",
                  size: 20,
                }),
              ],
            }),
            ...data.education.map((edu) => (
              new Paragraph({
                children: [
                  new TextRun({
                    text: `תואר: ${edu.degree}, בית ספר: ${edu.school}, ${edu.startDate ? `תאריך התחלה: ${edu.startDate.toLocaleDateString()}` : ''}${edu.endDate ? `, תאריך סיום: ${edu.endDate.toLocaleDateString()}` : ''}${edu.current ? ', סטודנט' : ''}`,
                  }),
                  new TextRun({
                    text: `\nתיאור: ${edu.description}`,
                  }),
                ],
              })
            )),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'resume.docx');
  };

  const handleSave = () => {
    console.log(data);
  };

  const isFormValid = () => {
    return (
      data.name &&
      data.email &&
      validateEmail(data.email) &&
      data.phone &&
      (!data.linkedin || validateURL(data.linkedin)) &&
      (!data.socialMedia || validateURL(data.socialMedia))
    );
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">יצירת קורות חיים</h1>

      <label className="block text-gray-500">שם מלא:</label>
      <input
        type="text"
        className="w-full p-2 border border-gray-500 rounded mb-4"
        name="name"
        value={data.name}
        onChange={handleChange}
        required
      />

      <label className="block text-gray-500">דוא"ל:</label>
      <input
        type="email"
        className="w-full p-2 border border-gray-500 rounded mb-4"
        name="email"
        value={data.email}
        onChange={handleChange}
        required
      />
      {!validateEmail(data.email) && data.email && <p className="text-red-500">כתובת דוא"ל לא תקינה</p>}

      <label className="block text-gray-500">טלפון:</label>
<div className="relative mb-4" style={{ direction: 'ltr' }}>
  <PhoneInput
    country={'il'}
    value={data.phone}
    onChange={(phone) => setData({ ...data, phone })}
    containerClass="!flex !flex-row-reverse"
    inputClass="!text-right !pl-[50px] !pr-3"
    buttonClass="!absolute !left-0 !top-1/2 !transform !-translate-y-1/2"
    containerStyle={{
      width: 'fit-content',
      minWidth: '200px',
      maxWidth: '300px'
    }}
    inputStyle={{
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      height: '38px' // Adjust this value to match your design
    }}
    buttonStyle={{
      border: 'none',
      background: 'transparent',
      padding: '0 8px'
    }}
    enableSearch={true}
    searchStyle={{ margin: '0' }}
  />
</div>


      <label className="block text-gray-500 mt-4">שפות:</label>
      <Select
        isMulti
        name="languages"
        options={iso6391.getAllCodes().map((code) => ({ value: code, label: iso6391.getName(code) }))}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleMultiSelectChange}
        value={data.languages}
      />

      <label className="block text-gray-500">תקציר מקדים:</label>
      <textarea
        className="w-full p-2 border border-gray-500 rounded mb-4"
        name="summary"
        value={data.summary}
        onChange={handleChange}
      ></textarea>

      <label className="block text-gray-500">קישורים:</label>
      <input
        type="url"
        placeholder="LinkedIn"
        className="w-full p-2 border border-gray-500 rounded mb-2"
        name="linkedin"
        value={data.linkedin}
        onChange={handleChange}
      />
      {!validateURL(data.linkedin) && data.linkedin && <p className="text-red-500">קישור לא תקין</p>}
      <input
        type="url"
        placeholder="Social Media"
        className="w-full p-2 border border-gray-500 rounded mb-4"
        name="socialMedia"
        value={data.socialMedia}
        onChange={handleChange}
      />
      {!validateURL(data.socialMedia) && data.socialMedia && <p className="text-red-500">קישור לא תקין</p>}

      {/* השכלה */}
      <h3 className="text-xl font-bold mt-6 text-orange-500">השכלה</h3>
      {data.education.map((edu, index) => (
        <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
          <label className="block text-gray-500">תואר:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={edu.degree}
            onChange={(e) => handleChange(e, 'education', index, 'degree')}
          />

          <label className="block text-gray-500">בית ספר:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={edu.school}
            onChange={(e) => handleChange(e, 'education', index, 'school')}
          />

          <label className="block text-gray-500">תאריך התחלה:</label>
          <DatePicker
            selected={edu.startDate}
            onChange={(date) => handleDateChange('education', index, 'startDate', date)}
            className="w-full p-2 border border-gray-500 rounded mb-4"
            dateFormat="dd/MM/yyyy"
          />

          <label className="block text-gray-500">תאריך סיום:</label>
          <DatePicker
            selected={edu.endDate}
            onChange={(date) => handleDateChange('education', index, 'endDate', date)}
            className="w-full p-2 border border-gray-500 rounded mb-4"
            dateFormat="dd/MM/yyyy"
            disabled={edu.current}
          />

          <label className="block text-gray-500">סטודנט:</label>
          <input
            type="checkbox"
            checked={edu.current}
            onChange={(e) => {
              const newEducation = [...data.education];
              newEducation[index].current = e.target.checked;
              if (e.target.checked) {
                newEducation[index].endDate = null;
              }
              setData({ ...data, education: newEducation });
            }}
            className="mb-4"
          />

          <label className="block text-gray-500">תיאור:</label>
          <textarea
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={edu.description}
            onChange={(e) => handleChange(e, 'education', index, 'description')}
          ></textarea>

          <button onClick={removeField('education', index)} 
          className="bg-red-500 text-white p-2 rounded">
            הסר
          </button>
        </div>
      ))}
      <button onClick={handleAddEducation} className="bg-gray-500 text-white p-2 rounded mb-4">
        הוסף השכלה
      </button>

      {/* ניסיון תעסוקתי */}
      <h3 className="text-xl font-bold mt-6 text-orange-500">ניסיון תעסוקתי</h3>
      {data.experience.map((exp, index) => (
        <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
          <label className="block text-gray-500">משרה:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={exp.position}
            onChange={(e) => handleChange(e, 'experience', index, 'position')}
          />

          <label className="block text-gray-500">חברה:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={exp.company}
            onChange={(e) => handleChange(e, 'experience', index, 'company')}
          />

          <label className="block text-gray-500">תאריך התחלה:</label>
          <DatePicker
            selected={exp.startDate}
            onChange={(date) => handleDateChange('experience', index, 'startDate', date)}
            className="w-full p-2 border border-gray-500 rounded mb-4"
            dateFormat="dd/MM/yyyy"
          />

          <label className="block text-gray-500">תאריך סיום:</label>
          <DatePicker
            selected={exp.endDate}
            onChange={(date) => handleDateChange('experience', index, 'endDate', date)}
            className="w-full p-2 border border-gray-500 rounded mb-4"
            dateFormat="dd/MM/yyyy"
            disabled={exp.current}
          />

          <label className="block text-gray-500">עדיין עובד כאן:</label>
          <input
            type="checkbox"
            checked={exp.current}
            onChange={(e) => {
              const newExperience = [...data.experience];
              newExperience[index].current = e.target.checked;
              if (e.target.checked) {
                newExperience[index].endDate = null;
              }
              setData({ ...data, experience: newExperience });
            }}
            className="mb-4"
          />

          <label className="block text-gray-500">תיאור:</label>
          <textarea
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={exp.description}
            onChange={(e) => handleChange(e, 'experience', index, 'description')}
          ></textarea>

          <button onClick={removeField('experience', index)} 
          className="bg-red-500 text-white p-2 rounded">
            הסר
          </button>
         
        </div>
      ))}
      <button onClick={handleAddExperience} className="bg-gray-500 text-white p-2 rounded mb-4">
        הוסף ניסיון תעסוקתי
      </button>

      {/* פרויקטים */}
      <h3 className="text-xl font-bold mt-6 text-orange-500">פרויקטים</h3>
      {data.projects.map((proj, index) => (
        <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
          <label className="block text-gray-500">כותרת:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={proj.title}
            onChange={(e) => handleChange(e, 'projects', index, 'title')}
          />

          <label className="block text-gray-500">תיאור:</label>
          <textarea
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={proj.description}
            onChange={(e) => handleChange(e, 'projects', index, 'description')}
          ></textarea>

          <label className="block text-gray-500">קישור:</label>
          <input
            type="url"
            className="w-full p-2 border border-gray-500 rounded mb-4"
            value={proj.link}
            onChange={(e) => handleChange(e, 'projects', index, 'link')}
          />
          {!validateURL(proj.link) && proj.link && <p className="text-red-500">קישור לא תקין</p>}

          <button onClick={removeField('projects', index)} 
          className="bg-red-500 text-white p-2 rounded">
          הסר
        </button>
        </div>
      ))}
      <button onClick={handleAddProject} className="bg-gray-500 text-white p-2 rounded mb-4">
        הוסף פרויקט
      </button>

      <div className="flex justify-between mt-8">
        <button
          onClick={generateDoc}
          className="bg-orange-500 text-white p-4 rounded-lg disabled:opacity-50"
          disabled={!isFormValid()}
        >
          הורדת קובץ קורות חיים
        </button>
        <button
          onClick={handleSave}
          className="bg-gray-500 text-white p-4 rounded-lg"
        >
          שמור
        </button>
      </div>
    </div>
  );
};

export default ResumeBuilder;

