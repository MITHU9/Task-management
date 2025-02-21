import { TaskCard } from "./Task";
import { Plus } from "lucide-react";

const categoryColors = {
  Todo: "bg-purple-100",
  InProgress: "bg-blue-100",
  Done: "bg-green-100",
};

export function Column({ category, tasks, onAddTask, onDelete, onEdit }) {
  console.log(tasks);

  return (
    <div className=" rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full ${categoryColors[category]}`}>
          <h2 className="font-medium text-sm">{category}</h2>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {tasks?.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
