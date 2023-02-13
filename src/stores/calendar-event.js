import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "axios";
import { useCalendarListStore } from "./calendar-list";

export const useCalendarEventStore = defineStore("calendar-event", () => {
  const calendarEvent = ref([]);

  const getCalendarEvent = computed(() => {
    return calendarEvent.value;
  });

  const getFilteredCalendarEvents = computed(() => {
    const calendarListStore = useCalendarListStore();

    return calendarEvent.value.filter((event) =>
      calendarListStore.getSelectedList.includes(event.calendar)
    );
  });

  const fetchEvent = async () => {
    await axios
      .get(import.meta.env.VITE_API_DOMAIN + "/api/events?format=json")
      .then((response) => {
        calendarEvent.value = response.data;
      });
  };

  return {
    fetchEvent,
    getFilteredCalendarEvents,
    getCalendarEvent,
  };
});
