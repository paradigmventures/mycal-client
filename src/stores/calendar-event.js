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
      .get(import.meta.env.VITE_API_DOMAIN + "/events")
      // .get(import.meta.env.VITE_API_DOMAIN + "/api/events?format=json")
      .then((response) => {
        calendarEvent.value = response.data;
      });
  };

  const addEvent = async (event) => {
    await axios
      .post(
        import.meta.env.VITE_API_DOMAIN + "/events",
        // import.meta.env.VITE_API_DOMAIN + "/api/events?format=json",
        event
        // {
        //   headers: {
        //     "X-CSRFToken": this.$cookies.get("csrftoken"),
        //   },
        // }
      )
      .then((response) => {
        fetchEvent();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const deleteEvent = async (uuid) => {
    await axios
      .delete(
        import.meta.env.VITE_API_DOMAIN + "/events/" + uuid
        // import.meta.env.VITE_API_DOMAIN + "/api/events/"+uuid,
        // {
        //   headers: {
        //     "X-CSRFToken": this.$cookies.get("csrftoken"),
        //   },
        // }
      )
      .then((response) => {
        fetchEvent();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return {
    fetchEvent,
    addEvent,
    deleteEvent,
    calendarEvent,
    getFilteredCalendarEvents,
    getCalendarEvent,
  };
});
