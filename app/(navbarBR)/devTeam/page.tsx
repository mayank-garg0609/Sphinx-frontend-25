import React from "react";

const WRAPPER_CLASSES = `
  relative min-h-screen w-full 
  bg-gradient-to-br from-black/30 via-transparent to-black/40
  flex flex-col items-center justify-center px-4 py-8
`;

const CARD_CLASSES = `
  w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
  rounded-2xl border border-white/20 bg-black/20 backdrop-blur-md 
  p-6 sm:p-8 md:p-10 lg:p-12
  font-main text-white shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
  flex items-center justify-center
  transition-all duration-300 ease-in-out
`;

const TITLE_CLASSES = `
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
  font-bold text-[#3fe0b2] typewriter text-center
  leading-tight
`;

const MemoizedCard = React.memo(() => (
  <div className={CARD_CLASSES}>
    <h1 className={TITLE_CLASSES}>Coming Soon...</h1>
  </div>
));

MemoizedCard.displayName = "MemoizedCard";

const Accommodation = () => {
  return (
    <div className={WRAPPER_CLASSES}>
      <MemoizedCard />
    </div>
  );
};

export default React.memo(Accommodation);