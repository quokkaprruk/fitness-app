const moment = require("moment");

const levels = ["Beginner", "Intermediate", "Advanced"];
const dailyHours = 6; // Number of hours in a day (updated to 5)
const classDuration = 1; // Class duration in hours
const startTime = "08:00"; // Starting time for the schedule
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
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const year = moment().format("YYYY"); // current month
const month = moment().format("MM"); // current year

// Generate monthly schedule for trainers
function generateMonthlySchedule(trainers) {
  const schedule = [];

  const startOfMonth = moment(`${year}-${month}-01`);
  const daysInMonth = startOfMonth.daysInMonth();

  trainers.forEach((trainer) => {
    for (let day = 1; day <= daysInMonth; day++) {
      //   const currentDate = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

      let currentStartTime = moment(
        `${year}-${month}-${day} ${startTime}`,
        "YYYY-MM-DD HH:mm"
      );

      for (let i = 0; i < dailyHours; i++) {
        // Skip scheduling between 12:01 PM and 12:59 PM

        if (
          currentStartTime.isSameOrAfter(
            moment(currentStartTime).set({ hour: 12, minute: 0, second: 0 })
          ) &&
          currentStartTime.isBefore(
            moment(currentStartTime).set({ hour: 13, minute: 0, second: 0 })
          )
        ) {
          // Skip the class during the break period
          currentStartTime.add(1, "hour"); // Skip the hour and move to the next valid time
          continue;
        }
        const classType = i % 2 === 0 ? "online" : "on-site";

        const specialtyIndex = i % trainer.specialty.length;
        const levelIndex = i % levels.length;
        const level = levels[levelIndex];
        const currentSpecialty = trainer.specialty[specialtyIndex];

        const equipmentRequired =
          classType === "online"
            ? equipmentForSpecialty[currentSpecialty]
            : ["water"];

        const dayOfWeekStart = currentStartTime.day();
        const dayNameStart = weekDays[dayOfWeekStart];

        schedule.push({
          className: `${trainer.specialty[specialtyIndex]} - ${level}`,
          classType: classType,
          instructorId: trainer._id,
          day: dayNameStart, // should refer to weekDays ,
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
    }
  });

  return schedule;
}

module.exports = { generateMonthlySchedule };
