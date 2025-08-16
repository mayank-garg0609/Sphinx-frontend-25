 export  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          scale:1,
          transform: "translateY(0%)",
        },
        {
          opacity: 0.5,
          scale:0.9,
          transform: "translateY(-100px)",
        },
      ],
      {
        duration: 500,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );
    document.documentElement.animate(
      [
        {
          transform: "translateY(100%)",
        },
        {

          transform: "translateY(0)",
        },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }