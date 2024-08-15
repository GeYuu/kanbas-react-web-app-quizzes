import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
export default function ModuleControlButtons() {
  return (
    <div className="float-end d-flex align-items-center">
      <div className="border border-gray rounded-3 p-1 me-2">
        40% of Total
      </div>
      <BsPlus className="fs-4 me-2" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
