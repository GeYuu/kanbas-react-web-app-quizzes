import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { FaBullseye } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";

{/* Find more icons */ }
export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "300px" }}>
      <h2>Course Status</h2>
      <div className="d-flex">
        <div className="w-50 pe-1">
          <button className="btn btn-lg btn-secondary w-100 text-nowrap ">
            <MdDoNotDisturbAlt className="me-2 fs-5" />
            Unpublish
          </button>
        </div>
        <div className="w-50">
          <button className="btn btn-lg btn-success w-100">
            <FaCheckCircle className="me-2 fs-5" />
            Publish
          </button>
        </div>
      </div>
      <br />
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <BiImport className="me-2 fs-5" />
        Import Existing Content
      </button>
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <LiaFileImportSolid className="me-2 fs-5" />
        Import from Commons
      </button>

      {/*Choose Home Page button with a bullseye icon*/}
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <FaBullseye className="me-2 fs-5" />
        Choose Home Page
      </button>

      {/*view course stream with a graph icon*/}
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <FaChartLine className="me-2 fs-5" />
        View Course Stream
      </button>
      {/*new annoucement with a speaker icon*/}
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <HiSpeakerWave className="me-2 fs-5" />
        New Announcement
      </button>

      {/*new analytics with a chart icon*/}
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <FaChartBar className="me-2 fs-5" />
        New Analytics
      </button>

      {/*view course notifications with a bell icon*/}
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <FaBell className="me-2 fs-5" />
        View Course Notifications
      </button>


    </div>
  );
}
