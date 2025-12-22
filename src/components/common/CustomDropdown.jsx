import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  options = [],
  selectedIndex,
  onSelect = () => {},
  placeholder,
  accentColor,
  error = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelectOption = (index) => {
    onSelect(index);
    setIsDropdownOpen(false);
  };

  const getAccentClasses = () => {
    const accentMap = {
      amber: {
        button: "border-amber-500/70 ring-amber-500/30",
        chevron: "text-amber-400",
        listBg: "shadow-amber-500/20",
        itemSelected: "bg-amber-900/40 border-l-amber-500/70 text-amber-300",
        itemHover: "hover:border-l-amber-500/70",
      },
      blue: {
        button: "border-blue-500/70 ring-blue-500/30",
        chevron: "text-blue-400",
        listBg: "shadow-blue-500/20",
        itemSelected: "bg-blue-900/40 border-l-blue-500/70 text-blue-300",
        itemHover: "hover:border-l-blue-500/70",
      },
      purple: {
        button: "border-purple-500/70 ring-purple-500/30",
        chevron: "text-purple-400",
        listBg: "shadow-purple-500/20",
        itemSelected: "bg-purple-900/40 border-l-purple-500/70 text-purple-300",
        itemHover: "hover:border-l-purple-500/70",
      },
      green: {
        button: "border-green-500/70 ring-green-500/30",
        chevron: "text-green-400",
        listBg: "shadow-green-500/20",
        itemSelected: "bg-green-900/40 border-l-green-500/70 text-green-300",
        itemHover: "hover:border-l-green-500/70",
      },
    };

    return accentMap[accentColor] || accentMap.amber;
  };

  const accentClasses = getAccentClasses();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-full px-5 py-3.5 bg-slate-800/50 text-left flex items-center justify-between border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm font-['Montserrat'] ${
          error ? "border-red-500/50" : "border-slate-600/50"
        } ${isDropdownOpen && `${accentClasses.button} ring-2`}`}
      >
        <span
          className={`font-semibold ${
            selectedIndex !== null ? "text-white" : "text-slate-400"
          }`}
        >
          {selectedIndex !== null
            ? options[selectedIndex]
            : placeholder || "Chọn một tùy chọn"}
        </span>
        <ChevronDown
          className={`w-5 h-5 ${
            accentClasses.chevron
          } transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown list */}
      {isDropdownOpen && (
        <ul
          className={`absolute z-50 w-full max-h-56 mt-2 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl ${accentClasses.listBg} overflow-auto animate-in fade-in zoom-in-95 duration-200`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectOption(index)}
              className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300 border-b border-slate-700/30 hover:border-l-4 ${
                    accentClasses.itemHover
                  }
                  ${
                    selectedIndex === index
                      ? `${accentClasses.itemSelected} border-l-4`
                      : "hover:bg-slate-700/30"
                  }
                `}
            >
              {/* Content */}
              <div className="relative z-10 px-5 py-4 flex items-center gap-3 group">
                {/* Option name */}
                <div className="flex-1">
                  <p
                    className={`font-semibold transition-colors duration-200 ${
                      selectedIndex === index
                        ? "text-base"
                        : "text-slate-200 group-hover:text-slate-100"
                    }`}
                  >
                    {option}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
