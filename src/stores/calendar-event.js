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

  const addEvent = async (event) => {
    // construct a new event object
    let newEventObj = {
      calendar: event.calendar,
      title: event.title,
      description: event.description,
      start_dt: event.start_dt + ":00Z",
      end_dt: event.end_dt + ":00Z",
    };

    await axios
      .post(
        import.meta.env.VITE_API_DOMAIN + "/api/events?format=json",
        event,
        {
          headers: {
            "X-CSRFToken": this.$cookies.get("csrftoken"),
          },
        }
      )
      .then((response) => {
        calendarEvent.value.push(newEventObj);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return {
    fetchEvent,
    addEvent,
    calendarEvent,
    getFilteredCalendarEvents,
    getCalendarEvent,
  };
});
