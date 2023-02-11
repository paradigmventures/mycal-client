<template>
  <div class="lg:flex lg:h-full lg:flex-col bg-gray-100 border rounded-t-md">
    <Top />

    <div
      class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col"
    >
      <div
        class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
      >
        <div v-for="day in daysOfTheWeek" class="bg-white py-2">
          {{ day.substring(0, 1)
          }}<span class="sr-only sm:not-sr-only">{{
            day.substring(1, 3)
          }}</span>
        </div>
      </div>
      <div
        class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto"
      >
        <div class="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
          <div
            v-if="firstDayOfCurrentMonth > 0"
            v-for="day in firstDayOfCurrentMonth"
            :key="day"
            :class="'bg-gray-50 text-gray-500 relative py-2 px-3'"
          ></div>

          <div
            v-for="day in daysInCurrentMonth"
            :key="day"
            :class="'bg-white relative py-2 px-2'"
          >
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
            <ol v-if="maxThreeTodaysEvent(day, events).length" class="mt-2">
              <li
                v-for="evt in maxThreeTodaysEvent(day, events)"
                :key="evt.id"
                @click="togglePopover($event, evt)"
                class="w-full mt-2 group flex cursor-pointer items-center rounded px-1 py-0.5 text-xs font-medium"
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
              <!-- <li
                v-if="allTodaysEvent(day, events).length > 3"
                @click="openModal(day, allTodaysEvent(day, events))"
                class="text-gray-500 cursor-pointer"
              > -->
              <li
                v-if="allTodaysEvent(day, events).length > 3"
                class="text-gray-500 cursor-pointer"
              >
                + {{ allTodaysEvent(day, events).length - 3 }} more
              </li>
            </ol>
          </div>

          <div
            v-if="lastEmptyCells > 0"
            v-for="day in lastEmptyCells"
            :key="day"
            :class="'bg-gray-50 text-gray-500 relative py-2 px-3'"
          ></div>
        </div>

        <div class="isolate grid w-full grid-cols-7 gap-px lg:hidden">
          <div
            v-if="firstDayOfCurrentMonth > 0"
            v-for="day in firstDayOfCurrentMonth"
            :key="day"
            :class="'bg-gray-50'"
          ></div>

          <button
            v-for="day in daysInCurrentMonth"
            :key="day"
            type="button"
            :class="[
              'bg-white',
              isToday(day) ? 'font-semibold text-indigo-600' : 'text-gray-900',
              'flex h-14 flex-col py-2 px-3 hover:bg-gray-100 focus:z-10',
            ]"
          >
            <time
              :datetime="day.date"
              :class="[
                isToday(day) ? 'bg-indigo-600 text-white' : '',
                'flex h-6 w-6 items-center justify-center rounded-full',
                'ml-auto',
              ]"
              >{{ day }}</time
            >
            <span class="sr-only"
              >{{ allTodaysEvent(day, events).length }} events</span
            >
            <span
              v-if="maxThreeTodaysEvent(day, events).length > 0"
              class="-mx-0.5 mt-auto flex flex-wrap-reverse"
            >
              <span
                v-for="evt in maxThreeTodaysEvent(day, events)"
                :key="evt.id"
                class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
              />
            </span>
          </button>

          <div
            v-if="lastEmptyCells > 0"
            v-for="day in lastEmptyCells"
            :key="day"
            :class="'bg-gray-50 text-gray-500'"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- use the modal component -->
  <transition name="modal">
    <Modal
      v-if="modalShow"
      @close-modal="closeModal"
      @toggle-popover="togglePopover"
      :day="modalDay"
      :month="calendarStore.getMonth"
      :year="calendarStore.getYear"
      :events="modalEvents"
    />
  </transition>

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
import { ref, onMounted, onUpdated } from "vue";
import Top from "@/components/Top.vue";
import Modal from "@/components/EventsModal.vue";
import { useCalendarStore } from "../stores/calendar";
import { useCalendarEventStore } from "../stores/calendar-event";
import { useCalendarListStore } from "../stores/calendar-list";
import { usePopover } from "../composables/popover";
import { useCalendarColor } from "../composables/calendar-colors.js";
import axios from "axios";

const events = ref([]);

/**
 * Store initialization and subscription
 */
// Calendar events store
const calendarEventStore = useCalendarEventStore();
// Calendar store & subscription
const calendarStore = useCalendarStore();
calendarStore.$subscribe((mutation, state) => {
  getDaysInMonth();
  getFirstDayOfMonth();
});
// Calendar list store & subscription
const calendarListStore = useCalendarListStore();
calendarListStore.$subscribe((mutation, state) => {
  events.value = calendarEventStore.getFilteredCalendarEvents;
});

const {
  containerColorTags,
  checkboxColorTags,
  labelColorTags,
  getContainerColor,
  getTextColor,
  getCircleColor,
} = useCalendarColor();

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
const modalShow = ref(false);
const modalDay = ref(0);
const popoverRef = ref(null);
const modalEvents = ref([]);

// popover composable
const { popoverShow, todaysEvent, togglePopover } = usePopover(popoverRef);

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
 * Gets at most, 3 calendar events on a given day
 * This events are displayed on the calendar grid (>= Large screens)
 *
 * @param {number} day calendar month day whose event(s) we're getting
 * @param {array} events Array of events objects to filter through
 *
 * @return array Array of the filtered day's event(s)
 */
const maxThreeTodaysEvent = (day, events) => {
  if (!events.length) return [];

  let threeTodaysEventArr = [];

  events.forEach((event) => {
    if (threeTodaysEventArr.length == 3) return threeTodaysEventArr;

    if (isEventToday(day, event.start_dt)) {
      threeTodaysEventArr.push(event);
    }
  });

  return threeTodaysEventArr;
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
    if (isEventToday(day, event.start_dt)) {
      todaysEvent.push(event);
    }
  });

  return todaysEvent;
};

/**
 * Open the event details modal
 *
 * @param {number} day current calendar month day
 * @param {array} events Array of events objects to show on the modal
 *
 * @return null
 */
const openModal = (day, events) => {
  popoverShow.value = false; // close any open popover before opening modal
  modalEvents.value = events;
  modalDay.value = day;
  modalShow.value = true;
};

/**
 * Close the event details modal
 */
const closeModal = () => {
  modalEvents.value = [];
  modalShow.value = false;
  modalDay.value = 0;
};

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  getDaysInMonth();
  getFirstDayOfMonth();
  lastCalendarCells();
  // API call
  calendarEventStore.fetchEvent().then(() => {
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
