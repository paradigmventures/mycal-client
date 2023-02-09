import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "axios";

export const useCalendarListStore = defineStore("calendar-list", () => {
  const calendarList = ref([]);

  const getCalendarList = computed(() => {
    return calendarList.value;
  });

  const fetchList = async () => {
    await axios
      .get(import.meta.env.VITE_API_DOMAIN + "/api/calendars?format=json")
      .then((response) => {
        calendarList.value = response.data;
      });
  };

  return {
    fetchList,
    getCalendarList,
  };
});
