// Siripa
const moment = require("moment");

// Configurations
const levels = ["Beginner", "Intermediate", "Advanced"];
const dailyHours = 6; // 6 hours/day schedule for each trainer
const classDuration = 1; // 1 hour per class
const startTime = "08:00"; // Classes start at 8:00 AM

const equipmentForSpecialty = {
  HIIT: [
    "Dumbbells or kettlebells",
    "Resistance bands",
    "Jump rope",
    "Medicine ball",
    "Mat",
  ],
  "Weight Training": [
    "Dumbbells or barbells",
    "Resistance bands",
    "Weight bench",
    "Stability ball",
    "Mat",
    "Adjustable kettlebells",
  ],
  Yoga: ["Yoga mat", "Blocks", "Strap", "Cushion or bolster"],
  Meditation: [
    "Comfortable chair or cushion for sitting",
    "Meditation pillow or mat (optional for floor sitting)",
  ],
  Pilates: [
    "Pilates mat",
    "Resistance bands",
    "Pilates ring (optional)",
    "Small exercise ball",
    "Weights (optional)",
    "Foam roller (optional)",
  ],
  Cardio: [
    "Jump rope",
    "Stepper or stability step platform",
    "Resistance bands",
    "Mat",
  ],
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function generateWeeklySchedule(trainers) {
  const schedule = [];

  trainers.forEach((trainer) => {
    weekDays.forEach((day) => {
      let currentStartTime = moment(startTime, "HH:mm");

      for (let i = 0; i < dailyHours; i++) {
        if (
          currentStartTime.isBetween(
            moment("12:01", "HH:mm"),
            moment("12:59", "HH:mm"),
            null,
            "[)"
          )
        ) {
          currentStartTime.add(1, "hour"); // Skip the hour
          continue;
        }

        // assign 'online' or 'onsite'
        const classType = i % 2 === 0 ? "online" : "on-site";

        // assign the class specialty and difficulty level
        const specialtyIndex = i % trainer.specialty.length; // Cycle through specialties
        const levelIndex = i % levels.length; // Cycle through levels: Beginner, Intermediate, Advanced
        const level = levels[levelIndex];
        const currentSpecialty = trainer.specialty[specialtyIndex];

        const equipmentRequired =
          classType === "online"
            ? equipmentForSpecialty[currentSpecialty]
            : ["water"];
        schedule.push({
          className: `${trainer.specialty[specialtyIndex]} - ${level}`,
          classType: classType,
          instructorId: trainer._id,
          day: day,
          startDateTime: currentStartTime.format("YYYY-MM-DDTHH:mm:ssZ"),
          endDateTime: currentStartTime
            .add(classDuration, "hours")
            .format("YYYY-MM-DDTHH:mm:ssZ"),
          studentCapacity: 5, // by default
          currentReserved: 0, // by default
          studentList: [], // by default
          location: null, // by default
          classDetails: {
            description: "", // by default
            equipmentRequired: equipmentRequired, // by default
          },
        });
      }
    });
  });

  return schedule;
}

module.exports = { generateWeeklySchedule };
