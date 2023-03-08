<template>
  <div
    class="flex items-center rounded-md shadow-sm md:items-stretch text-xs md:text-base"
  >
    <button
      type="button"
      class="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-1 pl-1 pr-2 text-gray-500 hover:text-gray-600 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      @click="calendarStore.decrementMonth(1)"
      title="Previous month"
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
      class="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-1 pl-2 pr-1 text-gray-500 hover:text-gray-600 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      @click="calendarStore.incrementMonth(1)"
      title="Next month"
    >
      <span class="sr-only">Next month</span>
      <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { useCalendarStore } from "../stores/calendar";

const calendarStore = useCalendarStore();
</script>
