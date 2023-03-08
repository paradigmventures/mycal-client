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
            :class="bgColorTags[selected.value]"
          />
          <span class="ml-3 block truncate">{{ selected.key }}</span>
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
            v-for="(color, index) in addCalendarColors"
            :key="index"
            :value="color"
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
                  :class="bgColorTags[color.value]"
                  aria-hidden="true"
                />
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'ml-3 block truncate',
                  ]"
                >
                  {{ color.key }}
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
import { ref, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { useCalendarColor } from "../composables/calendar-colors";

// ini calendar colors composable
const { addCalendarColors, bgColorTags } = useCalendarColor();

defineProps({
  label: String,
  labelClass: String,
  fieldClass: String,
  formComponentIndex: Number,
});

const selected = ref(addCalendarColors.value[0]);

// define emit for passing selected color on selection change
const emit = defineEmits(["colorChanged"]);

// watch for change
watch(selected, (newSelection) => {
  emit("colorChanged", newSelection.value);
});
</script>
