import React, { useState, useEffect } from "react";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store';
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import * as client from "./client";

interface User {
  _id: string;
  username: string;
  role: string;
}

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const modules = useSelector((state: any) => state.modulesReducer.modules);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser as User | null);
  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const createModule = async (module: any) => {
    
    const newModule = await client.createModule(cid as string, module);
    dispatch(addModule(newModule));
  };
  const removeModule = async (moduleId: string) => {
    if (currentUser?.role === "FACULTY") {
      await client.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } else {
      alert("Only faculty can delete modules.");
    }
  };

  const saveModule = async (module: any) => {
    const status = await client.updateModule(module);
    dispatch(updateModule(module));
  };

  return (
    <div id="wd-modules">
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={() => {
          if (currentUser?.role === "FACULTY") {
            createModule({ name: moduleName, course: cid });
            setModuleName("");
          } else {
            alert("Only faculty can create modules.");
          }
        }}
      />
      <br />
      <br />
      <br />
      <br />
      <ul id="wd-modules" className="list-group rounded-0">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <li
              className="wd-module list-group-item p-0 mb-5 fs-5 border-gray"
              key={module._id}
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && currentUser?.role === "FACULTY" && (
                  <input
                    className="form-control w-50 d-inline-block"
                    onChange={(e) => saveModule({ ...module, name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveModule({ ...module, editing: false });
                      }
                    }}
                    value={module.name}
                  />
                )}
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => { 
                    if (currentUser?.role === "FACULTY") {
                      removeModule(moduleId); 
                    } else {
                      alert("Only faculty can delete modules.");
                    }
                  }}
                  editModule={() => {
                    if (currentUser?.role === "FACULTY") {
                      dispatch(editModule(module._id));
                    } else {
                      alert("Only faculty can edit modules.");
                    }
                  }}
                />
              </div>
              {module.lessons && (
                <ul className="wd-lessons list-group rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <li
                      className="wd-lesson list-group-item p-3 ps-1"
                      key={lesson._id}
                    >
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      <LessonControlButtons />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}