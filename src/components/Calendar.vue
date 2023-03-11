<template>
  <div class="flex h-full flex-col bg-gray-100 border-t rounded-t-md">
    <div
      class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-medium leading-6 text-gray-700 lg:flex-none"
    >
      <div v-for="day in daysOfTheWeek" class="bg-white py-1">
        {{ day.substring(0, 1)
        }}<span class="sr-only sm:not-sr-only">{{ day.substring(1, 3) }}</span>
      </div>
    </div>
    <div class="h-full w-full bg-gray-200 text-xs leading-6 text-gray-700">
      <div class="h-full w-full flex flex-wrap">
        <div
          v-if="firstDayOfCurrentMonth > 0"
          v-for="day in firstDayOfCurrentMonth"
          :key="day"
          class="w-[14.2857%] bg-gray-50 border-r border-b"
          :class="[getTotalGrid == 35 ? 'h-1/5' : 'h-1/6']"
        ></div>

        <div
          v-for="day in daysInCurrentMonth"
          :key="day"
          class="w-[14.2857%] bg-white border-r border-b p-1 overflow-hidden"
          :class="[getTotalGrid == 35 ? 'h-1/5' : 'h-1/6']"
        >
          <div class="flex flex-col flex-1">
            <div class="flex justify-center">
              <time
                :datetime="day.date"
                :class="
                  isToday(day)
                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
                    : undefined
                "
              >
                {{ day }}
              </time>
            </div>
            <ol v-if="maxTwoTodaysEvent(day, events).length" class="mt-0.5">
              <li
                v-for="evt in maxTwoTodaysEvent(day, events)"
                :key="evt.id"
                @click="togglePopover($event, evt)"
                class="w-full mt-0.5 group flex cursor-pointer items-center rounded py-0 px-1 text-[10.5px] font-medium"
                :class="[
                  getContainerColor(evt.calendar),
                  getTextColor(evt.calendar),
                ]"
              >
                <span
                  class="w-full flex whitespace-nowrap items-center overflow-x-hidden"
                >
                  <svg
                    class="h-2 w-1/5"
                    :class="[getCircleColor(evt.calendar)]"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>

                  <span class="w-4/5">
                    {{ evt.title }}
                  </span>
                </span>
              </li>
              <li
                v-if="allTodaysEvent(day, events).length > 2"
                class="mt-1 text-gray-500 cursor-pointer"
                @click="tPopover($event, allTodaysEvent(day, events), day)"
              >
                + {{ allTodaysEvent(day, events).length - 2 }} more
              </li>
            </ol>
          </div>
        </div>

        <div
          v-if="lastEmptyCells > 0"
          v-for="day in lastEmptyCells"
          :key="day"
          class="w-[14.2857%] bg-gray-50 border-r border-b"
          :class="[getTotalGrid == 35 ? 'h-1/5' : 'h-1/6']"
        ></div>
      </div>
    </div>
  </div>

  <div
    ref="eventListPopoverRef"
    :class="{ hidden: !pShow, block: pShow }"
    class="bg-gray-100 mb-3 block z-50 max-w-xs rounded-lg shadow-lg"
  >
    <EventListPopover
      v-if="pShow"
      :events="eList"
      @close="tPopover()"
      :day="getPDay"
      :month="calendarStore.getMonth"
      :year="calendarStore.getYear"
      @togglePopover="(event, evt) => togglePopover(event, evt)"
    />
  </div>

  <!-- popover component  -->
  <div
    ref="popoverRef"
    :class="{ hidden: !popoverShow, block: popoverShow }"
    class="bg-gray-100 mb-3 block z-50 max-w-xs rounded-lg shadow-md"
  >
    <slot
      name="eventDialog"
      :eventDialogData="todaysEvent"
      :closeEventDialog="togglePopover"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from "vue";
import { useCalendarStore } from "../stores/calendar";
import { useCalendarEventStore } from "../stores/calendar-event";
import { useCalendarListStore } from "../stores/calendar-list";
import { usePopover } from "../composables/popover";
import { useEventListPopover } from "../composables/event-list-popover";
import { useCalendarColor } from "../composables/calendar-colors.js";
import EventListPopover from "./EventListPopover.vue";

const events = ref([]);

/**
 * Store initialization and subscription
 */
// Calendar events store & subscription
const calendarEventStore = useCalendarEventStore();
calendarEventStore.$subscribe((mutation, state) => {
  // close all open popovers
  pShow.value = false;
  popoverShow.value = false;

  // re populate calendar when new event gets added or updated or deleted
  events.value = calendarEventStore.getFilteredCalendarEvents;
});

// Calendar store & subscription
const calendarStore = useCalendarStore();
calendarStore.$subscribe((mutation, state) => {
  getDaysInMonth();
  getFirstDayOfMonth();

  // API call when month change
  calendarEventStore.fetchActiveMonthEvent().then(() => {
    events.value = calendarEventStore.getFilteredCalendarEvents;
  });
});
// Calendar list store & subscription
const calendarListStore = useCalendarListStore();
calendarListStore.$subscribe((mutation, state) => {
  events.value = calendarEventStore.getFilteredCalendarEvents;
});

const { getContainerColor, getTextColor, getCircleColor } = useCalendarColor();

// component variables
const daysOfTheWeek = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};
const daysInCurrentMonth = ref(0);
const firstDayOfCurrentMonth = ref(0);
const lastEmptyCells = ref(0);
const popoverRef = ref(null);
const eventListPopoverRef = ref(null);

// popover composable
const { popoverShow, todaysEvent, togglePopover } = usePopover(popoverRef);
const { getPDay, pShow, eList, tPopover } =
  useEventListPopover(eventListPopoverRef);

/**
 * Gets the number of days present in a month
 * The month is gotten from the calendar store
 */
const getDaysInMonth = () => {
  daysInCurrentMonth.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth + 1, // 👈️ months are 0-based
    0
  ).getDate();
};

/**
 * Gets in number, the first day of a month
 * The month is gottenn from the calendar store
 */
const getFirstDayOfMonth = () => {
  firstDayOfCurrentMonth.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth,
    1
  ).getDay();
};

/**
 * Gets the last empty cells (if any) on the calendar grid
 */
const lastCalendarCells = () => {
  let totalGrid = firstDayOfCurrentMonth.value <= 5 ? 35 : 42;

  lastEmptyCells.value =
    totalGrid - daysInCurrentMonth.value - firstDayOfCurrentMonth.value;
};

/**
 * Gets the total grid present in the calendar
 */
const getTotalGrid = computed(() =>
  firstDayOfCurrentMonth.value <= 5 ? 35 : 42
);

/**
 * Validates a day to check if it's today or not
 *
 * @param {number} day The day to validate
 * @return boolean True or false if it's today or not
 */
const isToday = (day) => {
  let today = new Date();
  if (
    calendarStore.getYear == today.getFullYear() &&
    calendarStore.getMonth == today.getMonth() &&
    day == today.getDate()
  )
    return true;

  return false;
};

/**
 * Validates a day to check if event start date is current calendar date or not
 *
 * @param {number} day The calendar month date to check against
 * @param {string} startdate The event start date
 * @return boolean True or false if event is today or not
 */
const isEventToday = (day, startdate) => {
  if (
    calendarStore.getYear == startdate.substring(0, 4) &&
    calendarStore.getMonth + 1 == startdate.substring(5, 7) &&
    day == startdate.substring(8, 10)
  )
    return true;

  return false;
};

/**
 * Gets at most, 2 calendar events on a given day
 * This events are displayed on the calendar grid (>= Large screens)
 *
 * @param {number} day calendar month day whose event(s) we're getting
 * @param {array} events Array of events objects to filter through
 *
 * @return array Array of the filtered day's event(s)
 */
const maxTwoTodaysEvent = (day, events) => {
  if (!events.length) return [];

  let twoTodaysEventArr = [];

  for (let event of events) {
    if (twoTodaysEventArr.length == 2) break;

    if (isEventToday(day, event.start_date)) {
      twoTodaysEventArr.push(event);
    }
  }

  return twoTodaysEventArr;
};

/**
 * Gets all the calendar events on a given day
 *
 * @param {number} day calendar month day whose event(s) we're getting
 * @param {array} events Array of events objects to filter through
 *
 * @return array Array of the filtered day's event(s)
 */
const allTodaysEvent = (day, events) => {
  if (!events.length) return [];

  let todaysEvent = [];
  events.forEach((event) => {
    if (isEventToday(day, event.start_date)) {
      todaysEvent.push(event);
    }
  });

  return todaysEvent;
};

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  getDaysInMonth();
  getFirstDayOfMonth();
  lastCalendarCells();

  // API call on mount
  calendarEventStore.fetchActiveMonthEvent().then(() => {
    events.value = calendarEventStore.getFilteredCalendarEvents;
  });
});

onUpdated(() => {
  getFirstDayOfMonth();
  lastCalendarCells();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: translate 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  /** opacity: 0; **/
  translate: 0px 100%;
}
</style>
