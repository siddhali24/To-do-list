import { useState, useEffect, useMemo } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import confetti from "canvas-confetti";
import { FaFire, FaTint, FaLeaf, FaRocket, FaChevronDown, FaChevronUp } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem("water");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [weeklyStats, setWeeklyStats] = useState(() => {
    const saved = localStorage.getItem("weeklyStats");
    return saved ? JSON.parse(saved) : {};
  });

  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("priority");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("water", water.toString());
    localStorage.setItem("weeklyStats", JSON.stringify(weeklyStats));
  }, [tasks, water, weeklyStats]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );

      const task = updatedTasks.find((t) => t.id === id);
      if (task) {
        const reward = task.priority === 3 ? 40 : task.priority === 2 ? 20 : 10;
        const today = new Date().toISOString().split('T')[0];

        if (task.completed) {
          confetti();
          setWater(prev => prev + reward);
          setWeeklyStats(prev => ({
            ...prev,
            [today]: (prev[today] || 0) + reward
          }));
        } else {
          setWater(prev => Math.max(0, prev - reward));
          setWeeklyStats(prev => ({
            ...prev,
            [today]: Math.max(0, (prev[today] || 0) - reward)
          }));
        }
      }
      return updatedTasks;
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    if (window.confirm("Archive completed for a fresh start?")) {
      setTasks(tasks.filter(t => !t.completed));
    }
  };

  const level = Math.floor(water / 100) + 1;
  const xpInCurrentLevel = water % 100;
  const xpRemaining = 100 - xpInCurrentLevel;

  const plantData = useMemo(() => {
    if (level < 2) return { emoji: "🌱", stage: "Sprouts" };
    if (level < 4) return { emoji: "🌿", stage: "Sapling" };
    if (level < 7) return { emoji: "🎋", stage: "Bamboo" };
    if (level < 10) return { emoji: "🌳", stage: "Tree" };
    return { emoji: "🌸", stage: "Blooming" };
  }, [level]);

  const streak = useMemo(() => {
    const dates = Object.keys(weeklyStats).sort().reverse();
    let count = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      d.setHours(0, 0, 0, 0);
      const diff = Math.floor((current - d) / (1000 * 60 * 60 * 24));
      if (diff <= 1 && weeklyStats[dates[i]] > 0) {
        count++;
        current = d;
      } else if (diff > 1) break;
    }
    return count;
  }, [weeklyStats]);

  const processedTasks = useMemo(() => {
    let filtered = tasks;
    if (filter !== "All") filtered = filtered.filter(t => t.category === filter);
    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") return b.priority - a.priority;
      if (sortBy === "date") return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      return a.text.localeCompare(b.text);
    });
  }, [tasks, filter, sortBy]);

  const completedCount = tasks.filter(t => t.completed).length;

  const energyHistory = useMemo(() => {
    return [...Array(30)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      const val = weeklyStats[dateStr] || 0;
      return { date, dateStr, val, isToday: i === 29 };
    });
  }, [weeklyStats]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 lg:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-[1300px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">

        {/* LEFT COLUMN: Stats & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-5">

          {/* 1. ETREE PROGRESS */}
          <div className="bg-white rounded-[1.8rem] p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-5 mb-4">
              <div className="w-14 h-14 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white">
                {plantData.emoji}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">ETREE LEVEL {level}</p>
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{plantData.stage}</h3>
                <p className="text-[9px] font-bold text-slate-400 italic">
                  {xpRemaining} ml more to reach next level
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>Level Progress</span>
                <span>{xpInCurrentLevel}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.3)]" style={{ width: `${xpInCurrentLevel}%` }}></div>
              </div>
            </div>

            {/*  Energy Toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full pt-3 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Daily Energy History (30 Days) {showHistory ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Energy History Strip */}
            {showHistory && (
              <div className="mt-5 overflow-x-auto flex gap-2.5 pb-2 no-scrollbar custom-scrollbar animate-fade-in">
                {energyHistory.map((day, i) => (
                  <div key={i} className={`flex-none flex flex-col items-center gap-1 py-2 px-2 rounded-xl border transition-all ${day.isToday ? 'bg-indigo-600 border-indigo-600 shadow-md' : 'bg-slate-50 border-slate-100'}`}>
                    <span className={`text-[6px] font-black tracking-tighter uppercase ${day.isToday ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {day.date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}
                    </span>
                    <FaTint className={`text-[8px] ${day.isToday ? 'text-white' : 'text-indigo-400'}`} />
                    <span className={`text-[8px] font-black ${day.isToday ? 'text-white' : 'text-slate-800'}`}>+{day.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. ADD TASK AREA */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <AddTodo addTask={addTask} />
          </div>

        </div>

        {/* RIGHT side */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col min-h-[600px]">

            <header className="mb-10">
              {/* Header Row: Title and streak card beside it */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <h2 className="text-3xl font-black text-indigo-600 tracking-tighter flex items-center gap-3">
                  Priority Todo <FaRocket className="text-blue-500 animate-bounce" />
                </h2>

                {/* STREAK CARD */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl py-3 px-5 shadow-lg shadow-orange-100 flex items-center gap-4 group transition-transform hover:scale-105">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white text-sm">
                    <FaFire />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">Persistence</p>
                    <h4 className="text-sm font-black text-white leading-none">Streak: {streak} Days</h4>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100">
                <div className="flex gap-1 flex-wrap">
                  {["All", "General", "Work", "Study", "Personal"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${filter === cat ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  className="bg-white text-[9px] font-black uppercase text-slate-800 border border-slate-200 px-4 py-2 rounded-xl focus:ring-0 cursor-pointer outline-none shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="priority">Sort: By Priority</option>
                  <option value="date">Sort: By Due Date</option>
                  <option value="name">Sort: A-Z</option>
                </select>
              </div>
            </header>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6 px-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-3 bg-indigo-50 rounded-full text-indigo-500 font-bold text-[10px] uppercase tracking-widest border border-indigo-100">
                    {processedTasks.length} Active Plan
                  </span>
                </div>
                {completedCount > 0 && (
                  <button onClick={clearCompleted} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-1">
                    🗑️ Clean Up
                  </button>
                )}
              </div>

              <TodoList
                tasks={processedTasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            </div>
          </div>
        </div>
      </div>

      {/*  FOOTER */}
      <footer className="w-full mt-12 py-8 border-t border-slate-200 flex justify-center">
        <p className="text-sm font-black text-slate-900 flex items-center gap-2 font-mono tracking-wide italic">
          Made by Siddhali K.✌️😉
        </p>
      </footer>
    </div>
  );
}

export default App;