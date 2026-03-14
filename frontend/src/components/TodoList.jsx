import TodoItem from "./TodoItem";
import { AnimatePresence, motion } from "framer-motion";

function TodoList({ tasks, toggleTask, deleteTask, updateTask }) {
    if (tasks.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 px-4 rounded-[2rem] bg-white/30 border border-white/40"
            >
                <div className="text-5xl mb-4">✨</div>
                <p className="text-slate-500 font-bold text-lg">Clear skies!</p>
                <p className="text-slate-400 text-sm">Add a task to start your flow.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-1">
            <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        toggleTask={toggleTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default TodoList;
