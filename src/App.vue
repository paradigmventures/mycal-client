<template>
  <div>
    <!-- Static sidebar for desktop -->
    <transition
      enter-active-class="transition ease-in-out duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform -translate-x-full"
    >
      <div
        v-if="isSidebarOpen"
        class="top-[10%] flex flex-col h-full bg-white border-t border-gray-200"
        :class="[
          isSidebarOpen ? 'w-[50%] md:w-[25%] lg:w-[22%] fixed' : undefined,
        ]"
      >
        <Sidebar />
      </div>
    </transition>

    <div class="h-screen w-full flex flex-1 flex-col overflow-x-hidden">
      <!-- Render top nav -->
      <TopNav @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main
        class="h-[90%] flex flex-col transition-all ease-in-out duration-300"
        :class="[isSidebarOpen ? 'ml-[50%] md:ml-[25%] lg:ml-[22%]' : 'ml-0']"
      >
        <div class="flex-1 block">
          <!-- begin calendar //-->
          <Calendar>
            <template #eventDialog="props">
              <div
                class="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-sm shadow-md"
              >
                <div class="col-span-2" />
                <div>
                  <div class="flex justify-end space-x-1 items-center">
                    <XMarkIcon
                      class="w-4 h-4 cursor-pointer text-gray-700 hover:text-black transition-colors"
                      @click="props.closeEventDialog"
                    />
                  </div>
                </div>

                <div
                  v-if="props.eventDialogData && props.eventDialogData.title"
                  class="col-span-2"
                >
                  <div>
                    <h2 class="text-sm md:text-base font-medium text-gray-700">
                      {{ props.eventDialogData.title }}
                    </h2>
                    <h4 class="text-xs md:text-sm text-gray-700">
                      {{
                        new Date(
                          props.eventDialogData.start_date
                        ).toDateString()
                      }}
                    </h4>

                    <h4
                      class="mt-3 mb-5 w-full flex space-x-2 justify-start whitespace-nowrap items-center"
                    >
                      <svg
                        class="h-2"
                        :class="[
                          getCircleColor(props.eventDialogData.calendar),
                        ]"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>

                      <span class="text-sm font-normal">
                        {{ props.eventDialogData.calendar }}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
            </template>
          </Calendar>
          <!-- /End calendar -->
        </div>
      </main>
    </div>

    <!-- Add calendar notification -->
    <Notification
      :title="'Done!'"
      :body="'Calendar added successfully'"
      :icon-code="0"
      :show="notificationStore.getIfCalendarListNotificationIsOpen"
      @close="notificationStore.setIfCalendarListNotificationIsOpen(false)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Calendar from "./components/Calendar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useCalendarColor } from "./composables/calendar-colors.js";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import TopNav from "./components/TopNav.vue";
import { useCalendarListStore } from "./stores/calendar-list";
import { useNotification } from "./stores/notification";
import Notification from "./components/Notification.vue";
import { useStorage } from "@vueuse/core";

// Get calendar circle color
const { getCircleColor } = useCalendarColor();

// sidebar open/close state
// save in browser storage, so we can remember state of sidebabar if browser is refreshed
const isSidebarOpen = useStorage("sidebarOpen", false);

// Store initialization and subscription
const calendarListStore = useCalendarListStore();
// init notification store
const notificationStore = useNotification();

onMounted(() => {
  // Fetch calendar list
  // this should fetch all callendar colors even if the CalendarList component isn't mounted
  // ie: if sidebar isn't toggled to open state
  calendarListStore.fetchList();
});
</script>
