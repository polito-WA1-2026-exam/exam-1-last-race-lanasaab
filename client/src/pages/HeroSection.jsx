import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plane } from "lucide-react";

const HeroSection = ({ onEnter }) => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Background moves at 20% — deepest parallax layer
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  // Mid overlay drifts at 12% — creates layered depth
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  // Text drifts upward faster, pulling away from the background
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  // Entire hero content fades out as user scrolls into the arrival section
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  // Overlay darkens slightly as user scrolls
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.35, 0.72]);
  // Scroll indicator vanishes quickly once scrolling begins
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
        delayChildren:   0.3,
      },
    },
  };

  const itemVariants = {
    hidden:   { opacity: 0, y: 38 },
    visible:  {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={heroRef} className="hero-section">
      {/* Parallax background — deepest layer */}
      <motion.div className="hero-bg" style={{ y: bgY }} />

      {/* Mid-depth atmospheric overlay — drifts at half the bg speed */}
      <motion.div className="hero-overlay-mid" style={{ y: midY }} />

      {/* Base gradient overlay — darkens as user scrolls */}
      <motion.div
        className="hero-overlay-base"
        style={{ opacity: overlayOpacity }}
      />

      {/* Radial vignette */}
      <div className="hero-overlay-vignette" />

      {/* Bottom fade into the arrival section */}
      <div className="hero-overlay-bottom" />

      {/* Film-grain texture */}
      <div className="hero-grain" />

      {/* Sweeping light flare */}
      <div className="hero-light-sweep" />

      {/* Hero content: drifts up + fades out on scroll */}
      <motion.div
        className="hero-inner"
        style={{ y: textY, opacity: contentOpacity }}
      >
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div className="hero-badge" variants={itemVariants}>
            <Plane size={15} strokeWidth={2.5} />
            <span>LEBANON ARRIVAL MODE</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            Wanna discover
            <br />
            <span className="hero-title-accent">Lebanon?</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p className="hero-sub" variants={itemVariants}>
            You just landed. A hidden destination is waiting across the Lebanese
            metro network. Are you ready to enter the game, explore iconic cities,
            and begin your Last Race?
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <button className="hero-cta" onClick={onEnter}>
              <span>Sure, let me in</span>
              <span className="hero-cta-flag">🇱🇧</span>
              <span className="hero-cta-arrow">↓</span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — fades out as soon as user starts scrolling */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        style={{ opacity: indicatorOpacity }}
      >
        <motion.div
          className="scroll-dot"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
