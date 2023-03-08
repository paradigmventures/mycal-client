<template>
  <form class="w-full mt-10 mb-10 md:mb-0 space-y-3" @submit.prevent="submit()">
    <div>
      <SelectBox
        :label="'Color'"
        :label-class="'block text-sm font-medium text-gray-700'"
        @color-changed="colorSelectionChanged"
      />
    </div>

    <div>
      <label for="title" class="block text-sm font-medium text-gray-700"
        >Title</label
      >
      <div class="mt-1">
        <input
          type="text"
          v-model="form.title"
          id="title"
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
    </div>

    <div>
      <label for="slug" class="block text-sm font-medium text-gray-700"
        >Slug</label
      >
      <div class="mt-1">
        <input
          id="slug"
          v-model="form.slug"
          type="text"
          class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
    </div>

    <div>
      <label for="order" class="block text-sm font-medium text-gray-700"
        >Order
        <span class="text-xs font-light text-gray-600">(optional)</span></label
      >
      <div class="mt-1">
        <input
          id="order"
          v-model="form.order"
          type="number"
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
import SelectBox from "./SelectBox.vue";

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

// listen for color selection change
const colorSelectionChanged = (newColor) => {
  console.log(newColor);
};

// submit form
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
