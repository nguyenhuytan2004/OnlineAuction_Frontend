const Tooltip = ({
  text,
  position = "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
}) => {
  return (
    <div
      className={`absolute ${position} px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-100 shadow-md`}
    >
      {text}
    </div>
  );
};

export default Tooltip;
