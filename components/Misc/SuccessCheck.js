import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SuccessCheck() {
  const [isChecked, setisChecked] = useState(true);
  const pathLength = useMotionValue(0);
  const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1]);
  if (!isChecked) {
    window.location.href = "/";
  }
  return (
    <motion.div
      style={{
        width: 150,
        height: 150,
        borderRadius: 30,
        backgroundColor: "#F8FAF5",
        cursor: "pointer",
        border: "4px solid",
        borderColor: "#F8FAF5",
        marginLeft: "25px",
      }}
      animate={{
        scale: isChecked ? 1 : 0.8,
        backgroundColor: isChecked
          ? "rgba(255, 255, 255, 1)"
          : "rgba(255, 255, 255 ,0.5)",
      }}
      transition={{
        ease: "easeInOut",
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}
      onTap={() => setisChecked(!isChecked)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
        <motion.path
          d="M38 74.707l24.647 24.646L116.5 45.5"
          fill="transparent"
          strokeWidth="20"
          stroke="#8bc34a"
          strokeLinecap="round"
          animate={{ pathLength: isChecked ? 0.9 : 0 }}
          style={{ pathLength: pathLength, opacity: opacity }}
          // transition={{ duration: 3 }}
        />
      </svg>
    </motion.div>
  );
}