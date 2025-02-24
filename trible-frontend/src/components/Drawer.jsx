import { motion } from "framer-motion";

export default function Drawer({ isOpen, toggleDrawer, script }) {
  return (
    <motion.div 
      className="fixed right-0 top-0 h-full bg-gray-800 text-white w-80 shadow-lg flex flex-col p-4 overflow-y-auto"
      initial={{ x: 300 }} 
      animate={{ x: isOpen ? 0 : 300 }} 
      transition={{ type: "spring", stiffness: 100 }}
    >
      <button 
        className="absolute top-4 left-[-40px] bg-blue-600 text-white p-2 rounded-l-md"
        onClick={toggleDrawer}
      >
        {isOpen ? "→" : "←"}
      </button>

      <h2 className="text-xl font-bold mb-4">Expected Script</h2>
      <p className="text-sm">{script || "No script available for this scenario."}</p>
    </motion.div>
  );
}
