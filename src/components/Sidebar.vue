<template>
  <div
    class="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white py-3"
  >
    <div class="mt-5 flex flex-grow flex-col">
      <nav class="flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
        <div class="w-full px-3 lg:px-10 mb-5">
          <button
            type="button"
            class="w-full flex justify-center items-center rounded-2xl border border-transparent bg-indigo-600 py-2 text-xs lg:text-sm lg:font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="isAddCalendarModalShowing = true"
          >
            <PlusIcon class="h-8 w-7 font-bold" aria-hidden="true" />
            Add calendar
          </button>
        </div>
        <template v-for="item in navigation" :key="item.name">
          <div v-if="!item.children && !item.hasCustomChildren">
            <a
              href="#"
              :class="[
                item.current
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md',
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item.current
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 flex-shrink-0 h-6 w-6',
                ]"
                aria-hidden="true"
              />

              <span>
                {{ item.name }}
              </span>
            </a>
          </div>
          <Disclosure
            as="div"
            v-else
            class="space-y-1"
            v-slot="{ open }"
            default-open
          >
            <DisclosureButton
              :class="[
                item.current
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
              ]"
            >
              <component
                :is="item.icon"
                class="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span class="flex-1">{{ item.name }}</span>
              <svg
                :class="[
                  open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                  'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400',
                ]"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
              </svg>
            </DisclosureButton>
            <DisclosurePanel class="space-y-1">
              <CalendarList />
            </DisclosurePanel>
          </Disclosure>
        </template>
      </nav>
    </div>

    <AddEventModal
      :open="isAddCalendarModalShowing"
      :title="'Add new calendar'"
      :form-component-index="1"
      @close-modal="isAddCalendarModalShowing = false"
    />
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { PlusIcon } from "@heroicons/vue/20/solid";
import { CalendarIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import AddEventModal from "./AddEventModal.vue";
import CalendarList from "./CalendarList.vue";

// add calendar modal state
const isAddCalendarModalShowing = ref(false);

const navigation = [
  {
    name: "Calendar",
    icon: CalendarIcon,
    current: false,
    hasCustomChildren: true,
  },
];
</script>
