import unionBy from "lodash-es/unionBy";
import { formatDateTime, FORMAT } from "@/functions/dates";
import get from "lodash-es/get";

export function flatInvestorsFromSlots(event) {
  const total = [];
  const slots = eventSlots(event);
  if (slots) {
    slots.forEach((slot) => {
      if (slot.investors && slot.investors.length) {
        slot.investors.forEach((investor) => {
          total.push(
            Object.assign(investor, {
              slot_type: slot.type,
              venue_type_id: slot.venue.type_id,
              stats: get(slot, "venue.stats.attendees", []).find(
                (it) => it.email === investor.email
              ),
              interactionLog: slot.interactionLogs
                ? slot.interactionLogs.find((log) => log.user_id === investor.id)
                : null,
            })
          );
        });
      }
    });
  }
  return unionBy(total, (investor) => investor.id);
}

export function eventSlots(event) {
  return event.slots;
}

function formatDatesInPeriod(eventPeriodFormatted) {
  return eventPeriodFormatted.replace(/([0-9]{4}-[0-9]{2}-[0-9]{2})/g, (date) =>
    formatDateTime(date, FORMAT.DATE)
  );
}

export function datesPeriods(eventPeriodFormatted) {
  const formattedPeriods = formatDatesInPeriod(eventPeriodFormatted)
    .split(",")
    .map((period) => period.trim());

  if (formattedPeriods.length > 1) {
    return [formattedPeriods[0], formattedPeriods[formattedPeriods.length - 1]].join(" - ");
  } else {
    return formattedPeriods.join("");
  }
}

export function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
