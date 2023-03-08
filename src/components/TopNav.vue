<template>
  <div
    class="sticky top-0 z-10 flex justify-between items-center h-[10%] px-3 lg:px-5 flex-shrink-0 bg-white"
  >
    <!-- Left justified nav options -->
    <div class="flex justify-start items-center">
      <!-- Sidebar toggler -->
      <button
        type="button"
        class="flex justify-center items-center h-8 w-8 md:h-12 md:w-12 text-gray-500 focus:bg-gray-200 hover:bg-gray-100 rounded-full"
        @click="$emit('toggleSidebar')"
        title="Main menu"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-4 w-4 md:h-6 md:w-6" aria-hidden="true" />
      </button>
      <!-- End sidebar toggler -->

      <!-- Brand text -->
      <h2
        class="ml-2 md:ml-5 lg:ml-6 text-sm md:text-xl lg:text-2xl tracking-tight font-sans font-semibold md:font-black text-gray-600"
      >
        My Cal
      </h2>
      <!-- End brand text -->

      <!-- Date navigators -->
      <CalendarNavigator class="ml-2 md:ml-8 lg:ml-12" />
      <!-- End date navigators -->

      <!-- Datepicker -->
      <Datepicker
        v-model="date"
        auto-apply
        close-on-scroll
        @update:modelValue="handleDate"
      >
        <template #trigger>
          <!-- Current month & year notice -->
          <h1
            class="ml-2 md:ml-6 lg:ml-8 text-xs md:text-base lg:text-lg font-semibold text-gray-700 cursor-pointer"
          >
            <time datetime="2022-01"
              >{{ monthStr }} {{ calendarStore.getYear }}</time
            >
          </h1>
          <!-- End current month & year notice -->
        </template>
      </Datepicker>
      <!-- Datepicker -->
    </div>

    <!-- Right justified nav options -->
    <div class="flex">
      <div>
        <button
          type="button"
          class="ml-2 lg:ml-6 rounded-md border border-transparent bg-indigo-600 py-1.5 px-2 md:px-4 text-xs md:text-sm font-light md:font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="isAddEventModalShowing = true"
        >
          Add event
        </button>
      </div>
      <div class="ml-2 flex items-center md:ml-6">
        <!-- Profile dropdown -->
        <Menu as="div" class="relative ml-3">
          <div>
            <MenuButton
              class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </MenuButton>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <MenuItem
                v-for="item in userNavigation"
                :key="item.name"
                v-slot="{ active }"
              >
                <a
                  :href="item.href"
                  :class="[
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  ]"
                  >{{ item.name }}</a
                >
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>

    <AddEventModal
      :open="isAddEventModalShowing"
      :title="'Add new event'"
      :form-component-index="0"
      @close-modal="isAddEventModalShowing = false"
    />
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Bars3Icon } from "@heroicons/vue/24/outline";
import CalendarNavigator from "./CalendarNavigator.vue";
import { useCalendarStore } from "../stores/calendar";
import { ref, onMounted } from "vue";
import AddEventModal from "./AddEventModal.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// calendar store init
const calendarStore = useCalendarStore();

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
};

// user avatar dropdown items
const userNavigation = [{ name: "Sign out", href: "#" }];

// add event modal state
const isAddEventModalShowing = ref(false);

// Store subscription
calendarStore.$subscribe((mutation, state) => {
  prepareMonths();
  initializeDatePicker();
});

// HOOKS
onMounted(() => {
  prepareMonths();
  initializeDatePicker();
});
</script>
