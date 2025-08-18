
import Orb from "./Orb";
import SplitText from "./SplitText";
import BlurText from "./BlurText";
import Countdown from "./Countdown";
import LightRays from "./LightRays";
import Particles from "./Particles";



export default function Home() {
  return (
    <>
      <div className="z-15 absolute w-full h-dvh">
        <Particles
          particleColors={["#ffffff", "#3B82F6"]}
          particleCount={500}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="bg-black absolute w-full h-[120vh]">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      <div className="relative h-dvh w-full  flex justify-center items-center ">
        <Orb
          hoverIntensity={0.7}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
          className="w-[80vw] h-[80vw] sm:w-96 sm:h-96 absolute"
        />
        <div
          style={{ textShadow: "2px 2px 6px rgba(59, 130, 246, 0.7)" }}
          className="flex flex-col absolute justify-center h-full"
        >
          {" "}
          <SplitText
            text="SPHINX'25"
            className=" text-3xl sm:text-5xl tracking-wider font-space text-white  text-shadow-blue-500 shadow-lg  self-center font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.001}
            rootMargin="-100px"
            textAlign="center"
          />
          <BlurText
            text="Rajsthan's Largest Techno-Management Fest"
            delay={150}
            animateBy="letters"
            direction="top"
            className="sm:text-2xl font-sarif text-blue-700 "
          />
        </div>
      </div>
      <div className="flex justify-center relative bottom-[35vh] ">
        <Countdown />
      </div>
      
    </>
  );
}
