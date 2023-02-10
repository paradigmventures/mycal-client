<template v-if="calendarListStore.getCalendarList">
  <div
    v-for="calendar in calendarListStore.getCalendarList"
    :key="calendar.slug"
  >
    <div
      class="group flex w-full items-center rounded-md py-1 pl-8 pr-2 text-sm font-medium"
    >
      <label
        :for="calendar.slug"
        class="rounded-full p-1 cursor-pointer"
        :class="[containerColorTags[calendar.color]]"
      >
        <input
          class="form-checkbox align-text-bottom ml-2 rounded bg-gray-100 border-gray-300 focus:ring-2"
          :class="[checkboxColorTags[calendar.color]]"
          type="checkbox"
          :id="calendar.slug"
          :value="calendar.slug"
          v-model="selectedList"
          checked
          @change="selectedListChange"
        />

        <span
          class="inline-flex items-center rounded-full pl-2 pr-2.5 py-1 text-xs font-medium"
          :class="[labelColorTags[calendar.color]]"
          >{{ calendar.title }}</span
        >
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useCalendarListStore } from "../stores/calendar-list";
import { useCalendarColor } from "../composables/calendar-colors.js";

const { containerColorTags, checkboxColorTags, labelColorTags } =
  useCalendarColor();

// Store initialization and subscription
const calendarListStore = useCalendarListStore();

const selectedList = ref([]);

const selectedListChange = () => {
  calendarListStore.updateSelectedList(selectedList.value);
};

onBeforeMount(() => {
  // Fetch calendar list
  calendarListStore.fetchList().then(() => {
    selectedList.value = calendarListStore.getSelectedList;
  });
});
</script>
