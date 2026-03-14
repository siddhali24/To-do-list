import { useState, useRef } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaCalendarDay, FaWater } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function TodoItem({ task, toggleTask, deleteTask, updateTask }) {
    const [flyingWater, setFlyingWater] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [editDesc, setEditDesc] = useState(task.description || "");
    const checkboxRef = useRef(null);

    const priorityStyles = {
        3: "bg-rose-50 text-rose-500 border-rose-100",
        2: "bg-amber-50 text-amber-500 border-amber-100",
        1: "bg-blue-50 text-blue-500 border-blue-100"
    };

    const priorityLabel = { 3: "High", 2: "Mid", 1: "Low" };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0) && !task.completed;

    const handleToggle = () => {
        if (!task.completed && checkboxRef.current) {
            const rect = checkboxRef.current.getBoundingClientRect();
            // Target coordinates for the sidebar plant (estimate or dynamic)
            // Since it's on the left now, we aim for that general area
            const targetX = -rect.left + 60; 
            const targetY = -rect.top + 100;

            const drops = Array.from({ length: 8 }).map((_, i) => ({
                id: Date.now() + i,
                delay: i * 0.05,
                targetX: targetX + (Math.random() * 40 - 20),
                targetY: targetY + (Math.random() * 40 - 20)
            }));
            setFlyingWater(drops);
            setTimeout(() => setFlyingWater([]), 1500);
        }
        toggleTask(task.id);
    };

    const handleSave = () => {
        if (editText.trim()) {
            updateTask(task.id, { text: editText, description: editDesc });
            setIsEditing(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`group relative p-6 bg-white rounded-[2rem] border transition-all duration-500 ${task.completed ? 'border-slate-50 bg-slate-50/30' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100'} ${isOverdue ? 'border-rose-200 ring-4 ring-rose-50' : ''} mb-4`}
        >
            {isEditing ? (
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Task Name</label>
                        <input 
                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Notes</label>
                        <textarea 
                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-slate-600 focus:ring-2 focus:ring-indigo-500 resize-none min-h-[80px] placeholder:text-slate-300"
                            placeholder="Add details..."
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-1">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                            Update Task
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-5">
                    {/* Checkbox & Water Animation */}
                    <div className="relative flex items-center justify-center mt-1">
                        <input
                            ref={checkboxRef}
                            type="checkbox"
                            checked={task.completed}
                            onChange={handleToggle}
                            className="peer appearance-none w-7 h-7 border-2 border-slate-200 rounded-xl checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer z-10 shadow-sm hover:border-emerald-300"
                        />
                        <FaCheck className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity z-10 text-xs" />

                        <AnimatePresence>
                            {flyingWater.map((drop) => (
                                <motion.span
                                    key={drop.id}
                                    initial={{ opacity: 1, scale: 0 }}
                                    animate={{ 
                                        opacity: [0, 1, 1, 0],
                                        x: drop.targetX, y: drop.targetY,
                                        scale: [0.5, 1.5, 1, 0.5],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{ duration: 1.5, delay: drop.delay, ease: "easeOut" }}
                                    className="absolute pointer-events-none text-xl z-[100]"
                                >
                                    <FaWater className="text-blue-400 drop-shadow-md" />
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex flex-col pr-12">
                            <span className={`text-base font-black tracking-tight text-slate-800 break-words transition-all duration-500 ${task.completed ? "line-through text-slate-300 italic" : ""}`}>
                                {task.text}
                            </span>
                            {task.description && (
                                <p className={`text-xs text-slate-500 transition-all duration-300 ${task.completed ? "opacity-30" : "opacity-100"}`}>
                                    {task.description}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className={`text-[9px] tracking-widest uppercase font-black px-2.5 py-1 rounded-lg border shadow-sm ${priorityStyles[task.priority]}`}>
                                {priorityLabel[task.priority]}
                            </span>
                            <span className="text-[9px] tracking-widest uppercase font-black px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-400">
                                {task.category}
                            </span>
                            {task.dueDate && (
                                <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isOverdue ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                    <FaCalendarDay className="text-[11px]" />
                                    {isOverdue ? "Overdue" : task.dueDate}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-col sm:flex-row opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <button
                            onClick={() => setIsEditing(true)}
                            className="p-3 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            <FaEdit className="text-xs" />
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                            <FaTrash className="text-xs" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default TodoItem;
