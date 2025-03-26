// const { newGenerator } = require("./newGenerator"); // Adjust the path as necessary
const { generateMonthlySchedule } = require("./monthlyScheduleGenerator");
// Call the newGenerator function and pass trainers as an argument
const trainers = [
  {
    _id: "660a1f4b3b7e6c2f88777a1a",
    firstName: "Alice",
    lastName: "Johnson",
    teachingMode: ["online", "onsite"],
    specialty: ["Pilates", "Cardio"],
  },
  {
    _id: "660a1f4b3b7e6c2f88777a1b",
    firstName: "Bob",
    lastName: "Smith",
    teachingMode: ["onsite"],
    specialty: ["HIIT", "Weight Training"],
  },
  {
    _id: "660a1f4b3b7e6c2f88777a1c",
    firstName: "Charlie",
    lastName: "Brown",
    teachingMode: ["online"],
    specialty: ["Yoga", "Meditation"],
  },
];

// Call the function
generateMonthlySchedule(trainers);
// npm run generate-schedule
