import React, { useRef } from "react";
import HeroSection from "./HeroSection";
import ArrivalExperience from "./ArrivalExperience";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  const arrivalRef = useRef(null);

  const handleEnter = () => {
    arrivalRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="home-page">
      <HeroSection onEnter={handleEnter} />
      <div ref={arrivalRef}>
        <ArrivalExperience />
      </div>
    </main>
  );
};

export default Home;
