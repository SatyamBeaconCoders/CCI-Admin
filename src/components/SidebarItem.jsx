import { ChevronRight } from "lucide-react";

export default function SidebarItem({ 
  icon: Icon, 
  title, 
  active, 
  gradient = "from-blue-500 to-cyan-500",
  darkMode = false,
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200
        group
        relative
        overflow-hidden
        ${active 
          ? `text-white bg-blue-600 shadow-lg shadow-blue-200` 
          : darkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
        }
      `}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className={`
          p-2 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-white/20' 
            : darkMode
              ? 'bg-gray-800/50 group-hover:bg-gray-700/50'
              : 'bg-gray-50 group-hover:bg-blue-100'
          }
        `}>
          <Icon className={`
            w-4 h-4 transition-colors duration-200
            ${active 
              ? 'text-white' 
              : darkMode
                ? 'text-gray-500 group-hover:text-gray-300'
                : 'text-gray-500 group-hover:text-blue-600'
            }
          `} />
        </div>
        
        <span className="font-semibold text-sm">{title}</span>
        
        {active && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r shadow-[2px_0_8px_rgba(255,255,255,0.8)]"></div>
            <div className="ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-white/90"></div>
            </div>
          </>
        )}
        
        {!active && (
          <ChevronRight className={`
            w-3 h-3 ml-auto transition-all duration-200
            opacity-0 group-hover:opacity-100 group-hover:translate-x-1
            ${darkMode ? 'text-gray-600' : 'text-gray-400'}
          `} />
        )}
      </div>
    </button>
  );
}