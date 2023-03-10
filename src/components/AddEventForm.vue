<template>
  <form
    class="text-left w-full mt-10 mb-10 md:mb-0 space-y-3"
    @submit.prevent="submit()"
  >
    <div>
      <SelectCalendarBox
        :label="'Calendar'"
        :label-class="'block text-sm font-medium text-gray-700'"
        @calendar-changed="calendarSelectionChanged"
      />
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
      <div v-if="titleError">
        <span class="text-xs font-base text-red-600">{{ titleError }}</span>
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
      <div v-if="titleError">
        <span class="text-xs font-base text-red-600">{{
          descriptionError
        }}</span>
      </div>
    </div>

    <div>
      <label for="start_date" class="block text-sm font-medium text-gray-700"
        >Start Date</label
      >
      <div class="mt-1">
        <input
          id="start_date"
          v-model="form.start_date"
          type="date"
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
          v-model="form.end_date"
          type="date"
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
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useCalendarListStore } from "../stores/calendar-list";
import { useCalendarEventStore } from "../stores/calendar-event";
import { useNotification } from "../stores/notification";
import SelectCalendarBox from "./SelectCalendarBox.vue";

// Store initialization and subscription
const calendarListStore = useCalendarListStore();
const calendarEventStore = useCalendarEventStore();
// init notification store
const notificationStore = useNotification();

// component event definition
const emit = defineEmits(["closeModal"]);

const calendarList = ref([]);

// form data
const form = reactive({
  calendar: null,
  title: null,
  description: null,
  start_date: null,
  end_date: null,
});
// form error data
const titleError = ref("");
const descriptionError = ref("");

// listen for calendar selection change
const calendarSelectionChanged = (newCalendar) => {
  form.calendar = newCalendar;
};

const submit = () => {
  // validate required fields
  if (form.title.trim() == "" || form.title == null)
    return (titleError.value = "This field is invalid");

  if (form.description.trim() == "" || form.description == null)
    return (descriptionError.value = "This field is invalid");

  calendarEventStore.addEvent(form).then(() => {
    // show success notification
    notificationStore.setIfCalendarListNotificationIsOpen(true);

    emit("closeModal");
  });

  // close success notification after 2 secs
  setTimeout(() => {
    notificationStore.setIfCalendarListNotificationIsOpen(false);
  }, 2000);
};

onBeforeMount(() => {
  // Fetch calendar list
  calendarListStore.fetchList();
  calendarList.value = calendarListStore.getCalendarList;

  form.calendar = calendarList.value[0].slug;
});
</script>
