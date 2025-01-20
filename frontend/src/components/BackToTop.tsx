import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Button
        className={`back-to-top ${isVisible ? "visible" : ""}`}
        onClick={handleScrollToTop}
      >
        <i className="bi bi-arrow-up-short">↑</i>
      </Button>
    </>
  );
};

export default BackToTop;
