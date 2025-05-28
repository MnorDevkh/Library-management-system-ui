import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineArrowCircleUp } from "react-icons/hi";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="scroll-to-top animate-bounce"
            onClick={scrollToTop}
            variants={{
              initial: { y: "1rem", opacity: 0 },
              animate: {
                y: "-5rem",
                opacity: 1,
                transition: {
                  duration: 0.5,
                },
              },
            }}
            initial="initial"
            animate="animate"
            exit="initial"
          >
            <button
              type="button"
              className="bg-gray-100 shadow-xl hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-700"
            >
              <HiOutlineArrowCircleUp className="w-8 h-8 text-gray-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollToTop;