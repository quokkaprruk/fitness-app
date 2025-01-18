// Siripa
const moment = require("moment");

// Configurations
const dailyHours = 5; // 5 hours/day schedule for each trainer
const classDuration = 1; // 1 hour per class
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const startTime = "08:00"; // Classes start at 8:00 AM

const levels = ["Beginner", "Intermediate", "Advanced"];
// Equipment for each class specialty
const equipmentForSpecialty = {
  HIIT: [
    "Dumbbells or kettlebells",
    "Resistance bands",
    "Jump rope",
    "Medicine ball",
    "Mat (for floor exercises)",
    "Timer or interval app",
  ],
  "Weight Training": [
    "Dumbbells or barbells",
    "Resistance bands",
    "Weight bench",
    "Stability ball",
    "Mat (for floor exercises)",
    "Adjustable kettlebells",
  ],
  Yoga: [
    "Yoga mat (non-slip for safety)",
    "Blocks (for support in poses)",
    "Strap (to help with flexibility and alignment)",
    "Cushion or bolster (for comfort in certain poses)",
    "A quiet, calm space for relaxation",
  ],
  Meditation: [
    "Comfortable chair or cushion for sitting",
    "Meditation pillow or mat (optional for floor sitting)",
    "Timer or meditation app",
    "Soft lighting or calming atmosphere",
  ],
  Pilates: [
    "Pilates mat (thicker for comfort)",
    "Resistance bands",
    "Pilates ring (optional)",
    "Small exercise ball (for added resistance)",
    "Weights (optional for resistance work)",
    "Foam roller (optional for stretching)",
  ],
  Cardio: [
    "Jump rope",
    "Stepper or stability step platform",
    "Treadmill or stationary bike",
    "Resistance bands (for added resistance during bodyweight exercises)",
    "Mat (for floor exercises)",
  ],
};

// Generate weekly schedule for trainers
function generateWeeklySchedule(trainers) {
  const schedule = [];

  trainers.forEach((trainer) => {
    weekDays.forEach((day) => {
      let currentStartTime = moment(startTime, "HH:mm");

      // generate daily schedule for the trainer
      for (let i = 0; i < dailyHours; i++) {
        // skip scheduling between 12:01 PM and 12:59 PM
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
