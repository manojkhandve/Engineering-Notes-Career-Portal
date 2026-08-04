// import ComputerdFirst from "./branch/ComputerdFirst";

// const notesData = {
//   Computer: {
//     degree: {
//       "first-year": ComputerdFirst
//     }
//   }
// };

// export default notesData;


import ComputerdFirst from "./branch/ComputerdFirst";
const notesData = {
  Computer: {
    diploma: {
      "first-year": ComputerdFirst,
      "second-year": ComputerdFirst,
      "third-year": ComputerdFirst,
    },
    degree: {
      "first-year": ComputerdFirst,
      "second-year":ComputerdFirst,
      "third-year": ComputerdFirst,
      "fourth-year": ComputerdFirst,
    },
  },

  Information_T: {
    diploma: {
      "first-year": ComputerdFirst,
      "second-year":ComputerdFirst,
      "third-year": ComputerdFirst,
    },
    degree: {
      "first-year": ComputerdFirst,
      "second-year": ComputerdFirst,
      "third-year": ComputerdFirst,
    },
  },

  Civil: {
    diploma: {
      // add diploma components here
    },
    degree: {
      "second-year": ComputerdFirst,
    },
  },

  Electronics: {
    diploma: {
      // add components
    },
    degree: {
      "first-year": ComputerdFirst,
    },
  },

  Electrical: {
    diploma: {},
    degree: {
      "first-year": ComputerdFirst,
    },
  },

  Mechanical: {
    diploma: {},
    degree: {
      "first-year": ComputerdFirst,
    },
  },
};

export default notesData;