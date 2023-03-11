import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "axios";
import { useCalendarListStore } from "./calendar-list";
import { useCalendarStore } from "./calendar";

export const useCalendarEventStore = defineStore("calendar-event", () => {
  // init calendar list store & calendar store
  const calendarListStore = useCalendarListStore();
  const calendarStore = useCalendarStore();

  const calendarEvent = ref([]);

  const getCalendarEvent = computed(() => {
    return calendarEvent.value;
  });

  const getFilteredCalendarEvents = computed(() => {
    return calendarEvent.value.filter((event) =>
      calendarListStore.getSelectedList.includes(event.calendar)
    );
  });

  const getDaysInMonth = () => {
    return new Date(
      calendarStore.getYear,
      calendarStore.getMonth + 1, // 👈️ months are 0-based
      0
    ).getDate();
  };

  const fetchActiveMonthEvent = async () => {
    // get active month
    let activeMonth = calendarStore.getMonth + 1;
    // get active year
    let activeYear = calendarStore.getYear;
    // get total days in active month
    let totalDaysInActiveMonth = getDaysInMonth();
    // get selected calendars
    let selectedCalendars = calendarListStore.getSelectedList;

    let startDate = `${activeYear}-${activeMonth}-01`;
    let endDate = `End: ${activeYear}-${activeMonth}-${totalDaysInActiveMonth}`;

    await axios
      // .get(import.meta.env.VITE_API_DOMAIN + "/events")
      .get(
        `${
          import.meta.env.VITE_API_DOMAIN
        }/api/events?start_date=${startDate}&end_date=${endDate}&calendars=${selectedCalendars}`
      )
      .then((response) => {
        calendarEvent.value = response.data;
      });
  };

  /**
   * Fetch all events from server : GET
   */
  const fetchEvent = async () => {
    await axios
      .get(import.meta.env.VITE_API_DOMAIN + "/events")
      // .get(import.meta.env.VITE_API_DOMAIN + "/api/events?format=json")
      .then((response) => {
        calendarEvent.value = response.data;
      });
  };

  /**
   * Add a new event to server : POST
   * @param {Object} event The new event object
   */
  const addEvent = async (event) => {
    await axios
      .post(
        // import.meta.env.VITE_API_DOMAIN + "/events",
        import.meta.env.VITE_API_DOMAIN + "/api/events?format=json",
        event,
        {
          headers: {
            "X-CSRFToken": this.$cookies.get("csrftoken"),
          },
        }
      )
      .then((response) => {
        fetchActiveMonthEvent();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  /**
   * Update an already present event in server : PUT
   * @param {String} uuid The unique ID of the event to Update
   * @param {Object} event The updated event object
   */
  const updateEvent = async (uuid, event) => {
    await axios
      .put(
        // import.meta.env.VITE_API_DOMAIN + "/events/" + uuid,
        import.meta.env.VITE_API_DOMAIN + "/api/event/" + uuid,
        event,
        {
          headers: {
            "X-CSRFToken": this.$cookies.get("csrftoken"),
          },
        }
      )
      .then((response) => {
        fetchActiveMonthEvent();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  /**
   * Delete an event from server : DELETE
   * @param {String} uuid The unique ID of the event to delete
   */
  const deleteEvent = async (uuid) => {
    await axios
      .delete(
        // import.meta.env.VITE_API_DOMAIN + "/events/" + uuid
        import.meta.env.VITE_API_DOMAIN + "/api/event/" + uuid,
        {
          headers: {
            "X-CSRFToken": this.$cookies.get("csrftoken"),
          },
        }
      )
      .then((response) => {
        fetchActiveMonthEvent();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return {
    fetchEvent,
    fetchActiveMonthEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    calendarEvent,
    getFilteredCalendarEvents,
    getCalendarEvent,
  };
});
