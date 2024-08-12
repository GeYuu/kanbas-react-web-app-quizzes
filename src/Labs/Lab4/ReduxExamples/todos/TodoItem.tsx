import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
export default function TodoItem({ todo }: {
    todo: { id: string; title: string };

  }) {
    const dispatch = useDispatch();
    return (
      <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center
      ">
        {todo.title}
        <span>
        <button onClick={() => setTodo(todo)}
                id="wd-set-todo-click"
                className="me-2 btn btn-primary"
                > Edit </button>
        <button onClick={() => deleteTodo(todo.id)}
                id="wd-delete-todo-click"
                className="me-2 btn btn-danger"
                > Delete </button>

        </span>
      </li>
    );
  }
  