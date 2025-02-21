import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export function TaskCard({ task, index, onDelete, onEdit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(
    task.description || ""
  );

  //console.log(category);

  const handleEdit = () => {
    if (isEditing) {
      onEdit({
        ...task,
        title: editedTitle,
        description: editedDescription || undefined,
      });
    }
    setIsEditing(!isEditing);
    setIsMenuOpen(false);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-sm p-4 mb-2 relative group"
        >
          <div className="absolute z-40 right-2 top-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1  hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-4 h-4  text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute z-50 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-32">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  {isEditing ? "Save" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    onDelete(task._id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                maxLength={50}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Task title"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                maxLength={200}
                className="w-full border rounded px-2 py-1 text-sm resize-none"
                placeholder="Task description (optional)"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              )}
              {task.createdAt && (
                <p className="text-sm text-gray-600 mb-2">
                  Due: {new Date(task.createdAt).toLocaleDateString()}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}
