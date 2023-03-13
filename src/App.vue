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
          <!-- begin calendar -->
          <Calendar>
            <template #eventDialog="props">
              <div
                class="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-sm shadow-md"
              >
                <div class="col-span-2" />
                <div>
                  <div class="flex justify-end space-x-2 items-center">
                    <!-- Edit icon -->
                    <PencilSquareIcon
                      class="w-5 h-5 cursor-pointer text-gray-700 hover:text-black transition-colors"
                      @click="updateEvent(props.eventDialogData)"
                    />

                    <!-- Delete icon -->
                    <TrashIcon
                      class="w-5 h-5 cursor-pointer text-gray-700 hover:text-black transition-colors"
                      @click="isDeleteConfirmationModalOpen = true"
                    />

                    <!-- Close popover icon -->
                    <XMarkIcon
                      class="w-5 h-5 cursor-pointer text-gray-700 hover:text-black transition-colors"
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

                    <p class="mt-5 mb-2 text-sm text-gray-700">
                      {{ props.eventDialogData.description }}
                    </p>

                    <h4
                      class="my-3 w-full flex space-x-2 justify-start whitespace-nowrap items-center"
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

              <!-- confirm delete event modal -->
              <ConfirmModal
                :open="isDeleteConfirmationModalOpen"
                :title="'Delete event'"
                :body="'Are you sure you want to delete this event? All event data will be permanently removed. This action cannot be undone.'"
                @confirmed="
                  deleteEvent(
                    props.eventDialogData.uuid,
                    props.closeEventDialog
                  )
                "
                @cancelled="isDeleteConfirmationModalOpen = false"
              />
            </template>
          </Calendar>
          <!-- end calendar -->
        </div>
      </main>
    </div>

    <!-- Add calendar notification -->
    <Notification
      :title="'Done!'"
      :body="notificationStore.getCalendarNotificationMessage"
      :icon-code="0"
      :show="notificationStore.getIfCalendarListNotificationIsOpen"
      @close="
        notificationStore.setIfCalendarListNotificationIsOpen(false, null)
      "
    />

    <!-- Modify event modal (we are reusing the add event modal here, so ignore component name) -->
    <AddEventModal
      :open="isUpdateModalShowing"
      :title="'Update event'"
      :form-component-index="0"
      @close-modal="isUpdateModalShowing = false"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, provide } from "vue";
import Calendar from "./components/Calendar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useCalendarColor } from "./composables/calendar-colors.js";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import TopNav from "./components/TopNav.vue";
import { useCalendarListStore } from "./stores/calendar-list";
import { useCalendarEventStore } from "./stores/calendar-event";
import { useNotification } from "./stores/notification";
import Notification from "./components/Notification.vue";
import { useStorage } from "@vueuse/core";
import ConfirmModal from "./components/ConfirmModal.vue";
import AddEventModal from "./components/AddEventModal.vue";

// Get calendar circle color
const { getCircleColor } = useCalendarColor();

// sidebar open/close state
// save in browser storage, so we can remember state of sidebabar if browser is refreshed
const isSidebarOpen = useStorage("sidebarOpen", false);

// Store initialization and subscription
const calendarListStore = useCalendarListStore();
const calendarEventStore = useCalendarEventStore();
const notificationStore = useNotification();
// confirm delete modal state
const isDeleteConfirmationModalOpen = ref(false);
// event data for modification
// this will get populated on clicking the event's popover edit icon
const eventDataForUpdate = ref(null);
// update modal state
const isUpdateModalShowing = ref(false);

// provide event data for modification to deep child
// in this case: AddEventForm.vue & SelectCalendarBox.vue
provide("eventData", eventDataForUpdate);

const updateEvent = (eventData) => {
  eventDataForUpdate.value = eventData;
  isUpdateModalShowing.value = true;
};

// watch update modal state so we can discard provided data once it closes
watch(isUpdateModalShowing, (val) => {
  if (val == false) eventDataForUpdate.value = null;
});

/**
 * Delete an event
 * @param {Number} uuid The events unique ID
 * @param {Function} closeEventDialog The function responsible for closing the popover
 */
const deleteEvent = (uuid, closeEventDialog) => {
  calendarEventStore.deleteEvent(uuid).then(() => {
    //close popover
    closeEventDialog();
    // close confirm modal
    isDeleteConfirmationModalOpen.value = false;

    // show success notification and close after 2 seconds
    notificationStore.setIfCalendarListNotificationIsOpen(
      true,
      "Event deleted successfully"
    );
    setTimeout(() => {
      notificationStore.setIfCalendarListNotificationIsOpen(false, null);
    }, 2000);
  });
};

onMounted(() => {
  // Fetch calendar list
  // this should fetch all callendar colors even if the CalendarList component isn't mounted
  // ie: if sidebar isn't toggled to open state
  calendarListStore.fetchList();
});
</script>
