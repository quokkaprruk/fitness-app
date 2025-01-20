const moment = require("moment");
const fs = require("fs");
const path = require("path");
const levels = ["Beginner", "Intermediate", "Advanced"];
const dailyHours = 6; // 6 hr a day
const classDuration = 1;
const startTime = "08:00";

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

function generateMonthlySchedule(trainers) {
  const schedule = [];

  const startOfMonth = moment(`${year}-${month}-01`);
  const daysInMonth = startOfMonth.daysInMonth();

  trainers.forEach((trainer) => {
    for (let day = 1; day <= daysInMonth; day++) {
      let currentStartTime = moment(
        `${year}-${month}-${day} ${startTime}`,
        "YYYY-MM-DD HH:mm"
      );

      for (let i = 0; i < dailyHours; i++) {
        if (
          currentStartTime.isSameOrAfter(
            moment(currentStartTime).set({ hour: 12, minute: 0, second: 0 })
          ) &&
          currentStartTime.isBefore(
            moment(currentStartTime).set({ hour: 13, minute: 0, second: 0 })
          )
        ) {
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
          day: dayNameStart,
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
  //   fs.writeFileSync("schedule.json", JSON.stringify(schedule, null, 2), "utf-8");
  fs.writeFileSync(
    path.join(__dirname, "monthlySchedule.json"),
    JSON.stringify(schedule, null, 2),
    "utf-8"
  );

  return schedule;
}

module.exports = { generateMonthlySchedule };
