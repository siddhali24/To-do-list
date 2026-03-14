import { useState } from "react";
import { FaPlus, FaCalendarAlt, FaChevronDown } from "react-icons/fa";

function AddTodo({ addTask }) {
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        addTask({
            id: Date.now(),
            text,
            description,
            priority: priority || 2,
            category: category || "General",
            dueDate: dueDate || "",
            completed: false
        });

        setText("");
        setDescription("");
        setPriority("");
        setCategory("");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-center font-black text-indigo-600 uppercase tracking-[0.2em] text-[11px] mb-6">
                Plant a New Task
            </h3>
            
            <div className="flex flex-col gap-4">
                {/* Task Name Field */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-1.5">Task Name (Required) *</label>
                    <input
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-sans"
                        placeholder="e.g. Finish chemistry assignment"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {/* Description Field */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-1.5">Description (Optional)</label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all resize-none min-h-[70px] font-sans"
                        placeholder="Add some context or specific steps..."
                        maxLength="1000"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                
                {/* Meta Inputs Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-1.5">Priority</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-4 text-[10px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 cursor-pointer transition-all font-sans"
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value))}
                            >
                                <option value="" disabled hidden>Priority</option>
                                <option value={3}>🔥 High</option>
                                <option value={2}>⚡ Medium</option>
                                <option value={1}>🍃 Low</option>
                            </select>
                            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-1.5">Purpose</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-4 text-[10px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 cursor-pointer transition-all font-sans"
                            >
                                <option value="" disabled hidden>Purpose</option>
                                <option value="General">📂 General</option>
                                <option value="Work">💼 Work</option>
                                <option value="Study">🎓 Study</option>
                                <option value="Personal">👤 Personal</option>
                            </select>
                            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Deadline & Submit Row */}
                <div className="flex gap-2 items-end">
                    <div className="flex flex-col flex-1">
                        <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-1.5">Deadline</label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[42px] transition-all focus-within:ring-4 focus-within:ring-indigo-50">
                            <FaCalendarAlt className="text-slate-400 text-xs mr-3" />
                            <input 
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="w-full bg-transparent border-none text-[10px] font-bold text-slate-700 focus:ring-0 p-0 cursor-pointer font-sans"
                            />
                        </div>
                    </div>

                    <button className="bg-indigo-600 text-white w-[42px] h-[42px] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                        <FaPlus className="text-sm" />
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddTodo;
