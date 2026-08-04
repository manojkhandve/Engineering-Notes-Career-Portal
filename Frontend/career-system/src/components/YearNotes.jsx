import React from "react";
import { useParams } from "react-router-dom";
import notesData from "../notesData";

const YearNotes = () => {

  const { type, branch, year } = useParams();

  const SelectedComponent =
    notesData?.[branch]?.[type]?.[year];

  if (!SelectedComponent) {
    return (
      <div className="text-center mt-20 text-xl">
        Notes not available
      </div>
    );
  }

  return (
    <div className="mt-10">
      <SelectedComponent />
    </div>
  );
};

export default YearNotes;