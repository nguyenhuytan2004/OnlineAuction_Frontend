const BackgroundDecoration = ({ accentColor }) => {
  const getAccentClasses = () => {
    const accentMap = {
      amber: {
        topRight: "bg-gradient-to-bl from-amber-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-amber-500/20 to-transparent",
      },
      blue: {
        topRight: "bg-gradient-to-bl from-blue-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-blue-500/20 to-transparent",
      },
      purple: {
        topRight: "bg-gradient-to-bl from-purple-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-purple-500/20 to-transparent",
      },
      green: {
        topRight: "bg-gradient-to-bl from-green-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-green-500/20 to-transparent",
      },
      red: {
        topRight: "bg-gradient-to-bl from-red-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-red-500/20 to-transparent",
      },
      violet: {
        topRight: "bg-gradient-to-bl from-violet-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-violet-500/20 to-transparent",
      },
      indigo: {
        topRight: "bg-gradient-to-bl from-indigo-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-indigo-500/20 to-transparent",
      },
      emerald: {
        topRight: "bg-gradient-to-bl from-emerald-500/20 to-transparent",
        bottomLeft: "bg-gradient-to-tr from-emerald-500/20 to-transparent",
      },
    };

    return accentMap[accentColor] || accentMap.amber;
  };

  const accentClasses = getAccentClasses();

  return (
    <>
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${accentClasses.topRight}
          rounded-bl-full
          pointer-events-none z-0`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-32 h-32 ${accentClasses.bottomLeft}
          rounded-tr-full
          pointer-events-none z-0`}
      ></div>
    </>
  );
};

export default BackgroundDecoration;
