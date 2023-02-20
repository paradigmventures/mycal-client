<template>
  <div
    v-if="events.length"
    class="w-60 grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-sm shadow-md"
  >
    <div class="col-span-2" />
    <div>
      <div class="flex justify-end space-x-1 items-center">
        <XMarkIcon
          class="w-4 h-4 cursor-pointer text-gray-700 hover:text-black transition-colors"
          @click="$emit('close')"
        />
      </div>
    </div>

    <div class="h-48 lg:h-56 w-full col-span-3 overflow-y-auto">
      <div class="w-full">
        <h2 class="text-base md:text-lg font-medium text-gray-700">
          {{ modalDate.toDateString() }}
        </h2>

        <h4
          v-for="(evt, index) in events"
          :key="index"
          class="my-2 h-full w-full whitespace-nowrap rounded-md flex items-center cursor-pointer"
          :class="[getBgColor(evt.calendar), getTextColor(evt.calendar)]"
          @click="$emit('togglePopover', $event, evt)"
        >
          <span v-if="largerThanMd && index > 2" class="w-4 rounded-l-md" />
          <span v-else-if="!largerThanMd" class="w-4 rounded-l-md" />
          <span
            v-if="largerThanMd && index > 2"
            class="h-full w-full px-2 py-1 text-sm font-normal"
            :class="[getContainerColor(evt.calendar)]"
            >{{ evt.title }}</span
          >
          <span
            v-else-if="!largerThanMd"
            class="h-full w-full px-2 py-1 text-sm font-normal"
            :class="[getContainerColor(evt.calendar)]"
            >{{ evt.title }}</span
          >
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref, onMounted } from "vue";
import { useCalendarColor } from "../composables/calendar-colors.js";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

/**
 * get screen breakpoint to determine if we're displaying the unlisted events(for desktop screens)
 * or we're displaying all events(mobile screens)
 */
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater("md"); // only larger than md

const props = defineProps({
  events: Array,
  day: Number,
  month: Number,
  year: Number,
});

// Component state
const modalDate = ref(new Date());
const {
  containerColorTags,
  checkboxColorTags,
  labelColorTags,
  getContainerColor,
  getTextColor,
  getBgColor,
} = useCalendarColor();

/**
 * Format date from year, month and day prop
 */
const getDisplayDate = () => {
  modalDate.value = new Date(props.year, props.month, props.day);
};

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  getDisplayDate();
});
</script>
