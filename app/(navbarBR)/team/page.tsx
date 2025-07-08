import React from "react";

const WRAPPER_CLASSES = "relative min-h-screen w-full bg-transparent flex flex-col items-center justify-center";
const CARD_CLASSES = `
  absolute left-1/2 top-1/3 -translate-x-1/2
  w-[90%] max-w-md
  rounded-2xl border border-white/30 bg-black/80 p-8
  font-main text-white-md shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]
  lg:static lg:translate-x-0 lg:top-auto lg:bottom-auto lg:ml-auto lg:mr-36 lg:flex
`;
const TITLE_CLASSES =
"text-3xl font-bold text-[#3fe0b2] typewriter whitespace-nowrap";


const MemoizedCard = React.memo(() => (
  <div className={CARD_CLASSES} style={{ height: "100px" }}>
    <h1 className={TITLE_CLASSES}>Coming Soon...</h1>
  </div>
));
MemoizedCard.displayName = "MemoizedCard";

const Accommodation: React.FC = () => {
  return (
    <div className={WRAPPER_CLASSES}>
      <MemoizedCard />
    </div>
  );
};

export default React.memo(Accommodation);
