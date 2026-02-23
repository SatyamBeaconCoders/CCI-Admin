// // // export default function SidebarItem({ icon: Icon, title, active, onClick }) {
// // //   return (
// // //     <div
// // //       onClick={onClick}
// // //       className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium
// // //         transition
// // //         ${
// // //           active
// // //             ? "bg-green-600 text-white"
// // //             : "text-gray-700 hover:bg-orange-100"
// // //         }`}
// // //     >
// // //       <Icon size={18} />
// // //       {title}
// // //     </div>
// // //   );
// // // }

// // // 📁 components/SidebarItem.jsx
// // import { ChevronRight } from "lucide-react";

// // export default function SidebarItem({ 
// //   icon: Icon, 
// //   title, 
// //   active, 
// //   gradient = "from-gray-700 to-gray-800",
// //   activeGradient = "bg-gradient-to-r from-blue-500 to-cyan-500",
// //   onClick 
// // }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className={`
// //         w-full flex items-center gap-3 px-4 py-3 rounded-xl
// //         transition-all duration-200
// //         group
// //         ${active 
// //           ? `${activeGradient} text-white shadow-lg` 
// //           : `text-gray-300 hover:text-white hover:bg-gray-800/50`
// //         }
// //       `}
// //     >
// //       <div className={`
// //         p-2 rounded-lg
// //         transition-all duration-200
// //         ${active 
// //           ? 'bg-white/20' 
// //           : `bg-gradient-to-br ${gradient} group-hover:scale-110`
// //         }
// //       `}>
// //         <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
// //       </div>
      
// //       <span className="font-medium text-sm">{title}</span>
      
// //       {active && (
// //         <div className="ml-auto">
// //           <div className="w-2 h-2 rounded-full bg-white"></div>
// //         </div>
// //       )}
      
// //       {!active && (
// //         <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
// //       )}
// //     </button>
// //   );
// // }
// // 📁 components/SidebarItem.jsx
// import { ChevronRight } from "lucide-react";

// export default function SidebarItem({ 
//   icon: Icon, 
//   title, 
//   active, 
//   color = "orange",
//   iconColor = "text-orange-600",
//   bgColor = "bg-orange-50",
//   onClick 
// }) {
//   const activeColor = color === "green" ? "green" : "orange";
  
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         w-full flex items-center gap-3 px-4 py-3 rounded-xl
//         transition-all duration-200
//         group
//         ${active 
//           ? `bg-white border shadow-sm ${
//               activeColor === "green" 
//                 ? 'border-green-200 text-green-700' 
//                 : 'border-orange-200 text-orange-700'
//             }` 
//           : `text-gray-700 hover:text-gray-900 hover:bg-white hover:border hover:shadow-sm ${
//               color === "green" 
//                 ? 'hover:border-green-100' 
//                 : 'hover:border-orange-100'
//             }`
//         }
//       `}
//     >
//       <div className={`
//         p-2 rounded-lg transition-all duration-200
//         ${active 
//           ? activeColor === "green" 
//             ? 'bg-green-50' 
//             : 'bg-orange-50'
//           : `group-hover:scale-110 ${bgColor}`
//         }
//       `}>
//         <Icon className={`
//           w-4 h-4 transition-all duration-200
//           ${active 
//             ? activeColor === "green" 
//               ? 'text-green-600' 
//               : 'text-orange-600'
//             : `group-hover:text-${activeColor}-600 ${iconColor}`
//           }
//         `} />
//       </div>
      
//       <span className="font-medium text-sm">{title}</span>
      
//       {active && (
//         <div className="ml-auto">
//           <div className={`
//             w-2 h-2 rounded-full
//             ${activeColor === "green" ? 'bg-green-500' : 'bg-orange-500'}
//           `}></div>
//         </div>
//       )}
      
//       {!active && (
//         <ChevronRight className={`
//           w-3 h-3 ml-auto transition-all duration-200
//           opacity-0 group-hover:opacity-100
//           ${color === "green" ? 'text-green-400' : 'text-orange-400'}
//         `} />
//       )}
//     </button>
//   );
// }



// 📁 components/SidebarItem.jsx
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
          ? `text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r ${gradient} before:opacity-100` 
          : darkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800/30 border border-transparent hover:border-gray-700/50'
            : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 border border-transparent hover:border-gray-200/50'
        }
      `}
    >
      {/* Background gradient for active state */}
      {active && (
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-100`}></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className={`
          p-2 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-white/20' 
            : darkMode
              ? 'bg-gray-800/50 group-hover:bg-gray-700/50'
              : 'bg-gray-100 group-hover:bg-gray-200'
          }
        `}>
          <Icon className={`
            w-4 h-4 transition-colors duration-200
            ${active 
              ? 'text-white' 
              : darkMode
                ? 'text-gray-500 group-hover:text-gray-300'
                : 'text-gray-600 group-hover:text-gray-800'
            }
          `} />
        </div>
        
        <span className="font-medium text-sm">{title}</span>
        
        {active && (
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-white/90"></div>
          </div>
        )}
        
        {!active && (
          <ChevronRight className={`
            w-3 h-3 ml-auto transition-all duration-200
            opacity-0 group-hover:opacity-100 group-hover:translate-x-1
            ${darkMode ? 'text-gray-600' : 'text-gray-400'}
          `} />
        )}
      </div>
      
      {/* Shine effect on hover */}
      {!active && (
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-transparent via-white/5 to-transparent
          ${darkMode ? 'via-white/5' : 'via-black/5'}
        `}></div>
      )}
    </button>
  );
}