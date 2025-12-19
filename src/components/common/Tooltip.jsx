const Tooltip = ({ text, position = "bottom-full right-0 mb-2" }) => {
  return (
    <div
      className={`absolute ${position} px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md`}
    >
      {text}
    </div>
  );
};

export default Tooltip;
