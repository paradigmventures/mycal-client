<template>
  <header
    class="flex items-center justify-between border-b border-gray-200 py-4 px-6 lg:flex-none"
  >
    <h1 class="text-lg font-semibold text-gray-900">
      <time datetime="2022-01">{{ monthStr }} {{ calendarStore.getYear }}</time>
    </h1>
    <div class="flex items-center">
      <div class="flex items-center rounded-md shadow-sm md:items-stretch">
        <button
          type="button"
          class="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
          @click="calendarStore.decrementMonth(1)"
        >
          <span class="sr-only">Previous month</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
          @click="calendarStore.resetDate()"
        >
          Today
        </button>
        <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
        <button
          type="button"
          class="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
          @click="calendarStore.incrementMonth(1)"
        >
          <span class="sr-only">Next month</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden md:ml-4 md:flex md:items-center">
        <Datepicker
          v-model="date"
          auto-apply
          close-on-scroll
          @update:modelValue="handleDate"
        >
          <template #trigger>
            <div
              class="flex space-x-1 md:space-x-2 justify-around items-center border rounded-sm px-2 md:px-5 py-1 md:py-2 cursor-pointer hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div>
                <CalendarDaysIcon class="w-6 h-6" />
              </div>
              <div>
                <h1 class="text-xs md:text-base font-medium">
                  {{ shortMonthStr }}
                </h1>
              </div>
            </div>
          </template>
        </Datepicker>
        <div class="ml-6 h-6 w-px bg-gray-300" />
        <button
          type="button"
          class="ml-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="isModalShowing = true"
        >
          Add event
        </button>
      </div>
      <Menu as="div" class="relative ml-6 md:hidden">
        <MenuButton
          class="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">Open menu</span>
          <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <span
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer',
                  ]"
                  @click="isModalShowing = true"
                  >Add event</span
                >
              </MenuItem>
            </div>
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <span
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  @click="calendarStore.resetDate()"
                  >Go to today</span
                >
              </MenuItem>

              <Datepicker
                v-model="date"
                auto-apply
                close-on-scroll
                @update:modelValue="handleDate"
              >
                <template #trigger>
                  <div
                    class="flex space-x-1 md:space-x-2 justify-start items-center border rounded-sm px-2 md:px-5 py-1 md:py-2 cursor-pointer hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div>
                      <CalendarDaysIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <h1 class="text-sm">select date</h1>
                    </div>
                  </div>
                </template>
              </Datepicker>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>

  <AddEventModal :open="isModalShowing" @close-modal="isModalShowing = false" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCalendarStore } from "../stores/calendar";
import AddEventModal from "./AddEventModal.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

// Store initialization and subscription
const calendarStore = useCalendarStore();
calendarStore.$subscribe((mutation, state) => {
  prepareMonths();
  initializeDatePicker();
});

// Component variables
const date = ref(); // for datepicker
const monthStr = ref("");
const shortMonthStr = ref("");

/**
 * Populate the month variable with month data from store
 */
const prepareMonths = () => {
  monthStr.value = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(
      calendarStore.getYear,
      calendarStore.getMonth,
      calendarStore.getDay
    )
  );
  shortMonthStr.value = monthStr.value.substring(0, 3);
};

/**
 * Initiializes the datepicker with data gotten from store
 */
const initializeDatePicker = () => {
  date.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth,
    calendarStore.getDay
  );
};

/**
 * Change date from the datepicker
 * @param {Date} modelData The selected date from the datepicker
 */
const handleDate = (modelData) => {
  date.value = modelData;

  calendarStore.setMonth(date.value.getMonth());
  calendarStore.setYear(date.value.getFullYear());

  // do something else with the data
};

// The add event modal state
const isModalShowing = ref(false);

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  prepareMonths();
  initializeDatePicker();
});
</script>
