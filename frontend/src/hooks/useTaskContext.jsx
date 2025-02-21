import { useContext } from "react";
import { TaskContext } from "../context/Context";

export const useTaskContext = () => {
  return useContext(TaskContext);
};
