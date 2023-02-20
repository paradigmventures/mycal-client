<template>
  <form class="w-full mt-10 mb-10 md:mb-0 space-y-3" @submit.prevent="submit()">
    <div>
      <label for="calendar" class="block text-sm font-medium text-gray-700"
        >Calendar</label
      >
      <div class="mt-1">
        <select
          v-model="form.calendar"
          id="calendar"
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option
            v-for="calendar in calendarList"
            :key="calendar.slug"
            :value="calendar.slug"
          >
            {{ calendar.title }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label for="title" class="block text-sm font-medium text-gray-700"
        >Title</label
      >
      <div class="mt-1">
        <input
          id="title"
          v-model="form.title"
          type="text"
          required=""
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div class="mt-1">
      <label for="description" class="block text-sm font-medium text-gray-700"
        >Description</label
      >
      <div>
        <textarea
          id="description"
          v-model="form.description"
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>
    </div>

    <div>
      <label for="start_date" class="block text-sm font-medium text-gray-700"
        >Start Date</label
      >
      <div class="mt-1">
        <input
          id="start_date"
          v-model="form.start_dt"
          type="datetime-local"
          required=""
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="end_date" class="block text-sm font-medium text-gray-700"
        >End Date</label
      >
      <div class="mt-1">
        <input
          id="end_date"
          v-model="form.end_dt"
          type="datetime-local"
          required=""
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div class="pt-10 sm:pt-8 sm:flex sm:flex-row-reverse">
      <button
        type="submit"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:indigo-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Add event
      </button>
      <!-- <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
        @click="$emit('closeModal')"
      >
        Cancel
      </button> -->
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useCalendarListStore } from "../stores/calendar-list";
import { useCalendarEventStore } from "../stores/calendar-event";

// Store initialization and subscription
const calendarListStore = useCalendarListStore();
const calendarEventStore = useCalendarEventStore();

// component event definition
const emit = defineEmits(["closeModal"]);

const calendarList = ref([]);

// form data
const form = reactive({
  calendar: null,
  title: null,
  description: null,
  start_dt: null,
  end_dt: null,
});

const submit = () => {
  calendarEventStore.addEvent(form).then(() => {
    emit("closeModal");
  });
};

onBeforeMount(() => {
  // Fetch calendar list
  calendarListStore.fetchList();
  calendarList.value = calendarListStore.getCalendarList;

  form.calendar = calendarList.value[0].slug;
});
</script>
