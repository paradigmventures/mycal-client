<template>
  <div>
    <form
      class="w-full mt-10 mb-10 md:mb-0 space-y-3"
      @submit.prevent="submit()"
    >
      <div>
        <SelectColorBox
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
        <div v-if="titleError">
          <span class="text-xs font-base text-red-600">{{ titleError }}</span>
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
        <div v-if="slugError">
          <span class="text-xs font-base text-red-600">{{ slugError }}</span>
        </div>
      </div>

      <div>
        <label for="order" class="block text-sm font-medium text-gray-700"
          >Order
          <span class="text-xs font-light text-gray-600"
            >(optional)</span
          ></label
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
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useCalendarColor } from "../composables/calendar-colors";
import { useCalendarListStore } from "../stores/calendar-list";
import { useNotification } from "../stores/notification";
import SelectColorBox from "./SelectColorBox.vue";

// init calendar color composable
const { addCalendarColors } = useCalendarColor();
// init calendar list store
const calendarListStore = useCalendarListStore();
// init notification store
const notificationStore = useNotification();

// component event definition
const emit = defineEmits(["closeModal"]);

// form data
const form = reactive({
  title: null,
  slug: null,
  color: null,
  order: null,
});
// form error data
const titleError = ref("");
const slugError = ref("");

// listen for color selection change
const colorSelectionChanged = (newColor) => {
  form.color = newColor;
};

// submit form
const submit = () => {
  // first empty all error mssgs if present
  titleError.value = slugError.value = "";

  // validate required fields
  if (form.title.trim() == "" || form.title == null)
    return (titleError.value = "This field is invalid");

  if (form.slug.trim() == "" || form.slug == null)
    return (slugError.value = "This field is invalid");

  // close modal
  calendarListStore.addCalendarList(form).then(() => {
    // show success notification
    notificationStore.setIfCalendarListNotificationIsOpen(
      true,
      "Calendar added successfully!"
    );

    emit("closeModal");
  });

  // close success notification after 2 secs
  setTimeout(() => {
    notificationStore.setIfCalendarListNotificationIsOpen(false, null);
  }, 2000);
};

onBeforeMount(() => {
  // select the value which was selected by default in the color select component
  form.color = addCalendarColors.value[0].value;
});
</script>
