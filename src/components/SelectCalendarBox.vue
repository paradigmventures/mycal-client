<template>
  <Listbox as="div" v-model="selected">
    <ListboxLabel :class="labelClass">{{ label }}</ListboxLabel>
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-indigo-500 sm:text-sm sm:leading-6"
      >
        <span class="flex items-center">
          <span
            class="inline-block h-2 w-2 flex-shrink-0 rounded-full"
            :class="bgColorTags[selected.color]"
          />
          <span class="ml-3 block truncate">{{ selected.title }}</span>
        </span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            as="template"
            v-for="(calendar, index) in calendarList"
            :key="index"
            :value="calendar"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-3 pr-9',
              ]"
            >
              <div class="flex items-center">
                <span
                  class="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                  :class="bgColorTags[calendar.color]"
                  aria-hidden="true"
                />
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'ml-3 block truncate',
                  ]"
                >
                  {{ calendar.title }}
                </span>
              </div>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { ref, watch, inject, onBeforeMount } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { useCalendarColor } from "../composables/calendar-colors";
import { useCalendarListStore } from "../stores/calendar-list";

// ini calendar colors composable
const { bgColorTags } = useCalendarColor();

const props = defineProps({
  label: String,
  labelClass: String,
  fieldClass: String,
  selected: {
    required: false,
    default: null,
  },
});

// default selected
const selected = ref(null);
// get injected form data(for event update) if any
// so we get the selected option from update data
const eventUpdateData = inject("eventData");

// define emit for passing selected color on selection change
const emit = defineEmits(["calendarChanged"]);

// watch for change
watch(selected, (newSelection) => {
  emit("calendarChanged", newSelection.slug);
});

// Store initialization and subscription
const calendarListStore = useCalendarListStore();
const calendarList = ref([]);

const getCalendarObjectFromSlug = (slug) => {
  let objArr = calendarList.value.filter((calendar) => calendar.slug == slug);

  return objArr[0];
};

onBeforeMount(() => {
  // Fetch calendar list
  calendarListStore.fetchList();
  calendarList.value = calendarListStore.getCalendarList;

  // select first value in array by default
  selected.value =
    eventUpdateData.value != null
      ? getCalendarObjectFromSlug(eventUpdateData.value.calendar)
      : calendarList.value[0];
});
</script>
