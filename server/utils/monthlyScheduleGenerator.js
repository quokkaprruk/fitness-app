const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");
const levels = ["Beginner", "Intermediate", "Advanced"];
const dailyHours = 6; // 6 hr a day
const classDuration = 1;
// const startTime = "08:00";
const TIMEZONE = "America/Toronto";
// const equipmentForSpecialty = [
const classes = [
  "Cardio",
  "HIIT",
  "Yoga",
  "Weight Training",
  "Pilates",
  "Meditation",
];

const morningSlots = ["08:00", "09:00", "10:00", "11:00"];
const afternoonSlots = ["13:00", "14:00", "15:00"];
const eveningSlots = ["16:00", "17:00"];

function getRandomSlots(slots, count) {
  const shuffled = [...slots].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const year = moment().format("YYYY"); // current month
const month = moment().format("MM"); // current year

function generateMonthlySchedule(trainers) {
  console.log("generateMonthlySchedule called with trainers:", trainers); // Debugging

  const schedule = [];

  // For 30days
  const today = moment();
  const startOfMonth = moment(`${year}-${month}-01`);
  const daysInMonth = startOfMonth.daysInMonth();
  const todayDay = today.date();
  console.log(todayDay);
  const endDay = Math.min(todayDay + 6, daysInMonth); // 7 days
  console.log(endDay);

  trainers.forEach((trainer) => {
    for (let day = todayDay; day <= endDay; day++) {
      // for (let day = 1; day <= daysInMonth; day++) {

      const usedTimeSlots = new Set();

      let selectedSlots = [];
      // Randomly select 6 unique time slots for the day
      selectedSlots = [
        ...getRandomSlots(morningSlots, 2), // Select 2 morning slots
        ...getRandomSlots(afternoonSlots, 2), // Select 2 afternoon slots
        ...getRandomSlots(eveningSlots, 1), // Select 1 evening slot
      ];

      const remainingSlots = [
        ...morningSlots,
        ...afternoonSlots,
        ...eveningSlots,
      ].filter((slot) => !selectedSlots.includes(slot));

      const additionalSlot = getRandomSlots(remainingSlots, 1);
      selectedSlots = [...selectedSlots, ...additionalSlot];

      selectedSlots = selectedSlots.sort(() => Math.random() - 0.5);

      let currentStartTime;
      selectedSlots.forEach((slot, i) => {
        if (!usedTimeSlots.has(slot)) {
          usedTimeSlots.add(slot);
          currentStartTime = moment.tz(
            `${year}-${month}-${day} ${slot}`,
            "YYYY-MM-DD HH:mm",
            TIMEZONE
          );

          const location =
            trainer.teachingMode.length > 1
              ? trainer.teachingMode[
                  Math.floor(Math.random() * trainer.teachingMode.length)
                ].toLowerCase()
              : trainer.teachingMode[0].toLowerCase();

          const specialtyIndex = i % trainer.specialty.length;
          const levelIndex = i % levels.length;
          const level = levels[levelIndex];
          const className = trainer.specialty[specialtyIndex];

          schedule.push({
            className: className,
            difficultyLevel: level,
            instructorId: trainer._id,
            instructorFirstName: trainer.firstName,
            instructorLastName: trainer.lastName,
            startDateTime: currentStartTime.format("YYYY-MM-DDTHH:mm:ssZ"),
            endDateTime: currentStartTime
              .add(classDuration, "hours")
              .format("YYYY-MM-DDTHH:mm:ssZ"),
            studentCapacity: 5, // by default
            currentReserved: 0, // by default
            studentList: [], // by default
            location: location, // by default
            classDetails: {
              description: `A ${className}-${level} class taught by ${trainer.firstName} ${trainer.lastName}.`,
              equipmentRequired: [],
            },
          });
        }
      });
    }
  });

  schedule.sort((a, b) => {
    return moment(a.startDateTime).isBefore(moment(b.startDateTime)) ? -1 : 1;
  });

  return schedule;
}

module.exports = { generateMonthlySchedule };
