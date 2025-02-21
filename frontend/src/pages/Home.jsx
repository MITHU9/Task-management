import { Navigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useTaskContext } from "../hooks/useTaskContext";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Column } from "../components/Column";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAxiosPublic } from "../hooks/useAxiosPublic";
import useAllTasks from "../hooks/useAllTask";
import io from "socket.io-client";

const Home = () => {
  const socket = io("http://localhost:5000");

  const { user } = useTaskContext();
  const axiosPublic = useAxiosPublic();
  const [allTasks, isPending, refetch] = useAllTasks();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (allTasks) {
      setTasks(allTasks);
    }
  }, [allTasks]);

  if (isPending) return <div>Loading...</div>;

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    let updatedTasks = [...tasks];

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Group tasks by category before handling drag-and-drop
    const tasksByCategory = {
      Todo: tasks.filter((task) => task.category === "Todo"),
      InProgress: tasks.filter((task) => task.category === "InProgress"),
      Done: tasks.filter((task) => task.category === "Done"),
    };

    // Ensure source & destination columns exist
    const sourceTasks = tasksByCategory[source.droppableId] || [];
    const destTasks = tasksByCategory[destination.droppableId] || [];

    if (!sourceTasks.length || !destTasks.length) {
      console.error("Invalid source or destination column", {
        sourceTasks,
        destTasks,
      });
      return;
    }

    // Moving task within the same column
    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = [...sourceTasks];
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);

      const filteredTasks = updatedTasks.filter(
        (task) => task.category === source.droppableId
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.category === source.droppableId
            ? reorderedTasks.find((t) => t._id === task._id) || task
            : task
        )
      );

      updatedTasks = updatedTasks.map(
        (task) => filteredTasks.find((t) => t._id === task._id) || task
      );

      setTasks(updatedTasks);
      socket.emit("updateTaskOrder", updatedTasks);
    } else {
      // Moving task between different columns
      const sourceClone = [...sourceTasks];
      const destClone = [...destTasks];
      const [movedTask] = sourceClone.splice(source.index, 1);

      if (!movedTask) return;

      const updatedTask = { ...movedTask, category: destination.droppableId };
      destClone.splice(destination.index, 0, updatedTask);

      setTasks((prev) =>
        prev.map((task) => (task._id === movedTask._id ? updatedTask : task))
      );

      socket.emit("updateTask", {
        taskId: movedTask._id,
        category: destination.droppableId,
      });
    }
  };

  const handleAddTask = async (category) => {
    const newTask = {
      _id: Date.now(),
      title: "New Task",
      description: "Task description",
      category,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    try {
      await axiosPublic.post("/add-task", newTask);
      refetch(); // Refetch all tasks
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleEditTask = async (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    try {
      await axiosPublic.put(`/update-task/${updatedTask._id}`, updatedTask);
      refetch();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    try {
      await axiosPublic.delete(`/delete-task/${taskId}`);
      refetch();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  if (!user) return <Navigate to="/" />;

  return (
    <div>
      {user && <Navbar />}
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-semibold text-gray-900">
                Task Board
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {["Todo", "InProgress", "Done"].map((category) => (
                <Droppable key={category} droppableId={category}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-1/3 p-4 bg-gray-200 rounded-md"
                    >
                      <Column
                        category={category}
                        onAddTask={() => handleAddTask(category)}
                        tasks={tasks.filter(
                          (task) => task.category === category
                        )}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </main>
      </div>
    </div>
  );
};

export default Home;
