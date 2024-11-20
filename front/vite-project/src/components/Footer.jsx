import React from "react";

const Footer = () => {
  return (
    <>
      <div className="w-screen flex justify-evenly my-10 text-right">
        <ul>
          <li>
            <h5 className="text-2xl font-bold">כיצד למצוא עבודה?</h5>
          </li>
          <li>
            <a href="#">חיפוש עבודה בקלות</a>
          </li>
          <li>
            <a href="#">להירשם לאתר בחינם</a>
          </li>
          <li>
            <a href="#">חיפוש עבודה לפי תחום</a>{" "}
          </li>
          <li>
            <a href="#">חיפוש עבודה לפי חברה</a>
          </li>
          <li>
            <a href="#">חיפוש לפי מיקום גאוגרפי</a>
          </li>
          <li>
            <a href="#">חיפוש לפי רמת ניסיון</a>{" "}
          </li>
        </ul>
        <ul>
          <li>
            <h5 className="text-2xl font-bold">מתחם השכר</h5>
          </li>
          <li>
            <a href="">טבלאות שכר</a>
          </li>
          <li>
            <a href="">נתוני שכר לפי תפקיד</a>
          </li>
          <li>
            <a href="">חיפוש עבודה בקלות</a>
          </li>
        </ul>
        <ul>
          <li>
            <h5 className="text-2xl font-bold">גיוס עובדים</h5>
          </li>
          <li>
            <a href="">פרסום מודעת דרושים</a>
          </li>
          <li>
            <a href="">חיפוש וגיוס עובדים</a>
          </li>
          <li>
            <a href="">חיפוש עבודה בקלות</a>
          </li>
        </ul>
        <ul>
          <li>
            <h5 className="text-2xl font-bold">JobSeek</h5>
          </li>
          <li>
            <a href="">הצהרת נגישות</a>
          </li>
          <li>
            <a href="">מדיניות פרטיות</a>
          </li>
          <li>
            <a href="/">מי אנחנו</a>
          </li>
          <li>
            <a href="/">שאלות נפוצות</a>
          </li>
          <li>
            <a href="/">שירות לקוחות</a>
          </li>
          <li>
            <a href="/">תנאי שימוש</a>
          </li>
        </ul>
      </div>
      <div className="px-20 py-5">
        <div className="flex items-center justify-center">
          <hr className="w-8/12 h-1 mx-auto my-4 border-0 rounded md:my-10 bg-gray-700" />
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 left-1/2 rounded-full bg-[#f18c19]">
            כל הזכויות שמורות לחברת טימי בע"מ - אלכס יופית 2, מגדל מליני, ערד
          </span>
        </div>

        <div className="flex justify-between items-center">
          <img
            src="/images/JobSeekLogoNew.png"
            alt="JobSeek"
            className="h-32"
          />

          <ul className="flex">
            <li>
              <a href="http://facebook.com/JobSeek">
                <i className="bx bx-lg bxl-facebook-circle"></i>
              </a>
            </li>
            <li>
              <a href="http://linkedin.com/JobSeek">
                <i className="bx bx-lg bxl-linkedin-square"></i>
              </a>
            </li>
            <li>
              <a href="http://youtube.com/JobSeek">
                <i className="bx bx-lg bxl-youtube"></i>
              </a>
            </li>
            <li>
              <a href="http://tiktok.com/JobSeek">
                <i className="bx bx-lg bxl-tiktok"></i>
              </a>
            </li>
            <li>
              <a href="http://instagram.com/JobSeek">
                <i className="bx bx-lg bxl-instagram-alt"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Footer;
