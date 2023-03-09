import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import axios from "axios";

export const useCalendarListStore = defineStore("calendar-list", () => {
  const calendarList = ref([]);
  const selectedList = useStorage("selected-list", []);

  const getCalendarList = computed(() => {
    return calendarList.value;
  });

  const getSelectedList = computed(() => {
    return selectedList.value;
  });

  const updateSelectedList = (newSelectedList) => {
    selectedList.value = newSelectedList;
  };

  const fetchList = async () => {
    await axios
      // .get(import.meta.env.VITE_API_DOMAIN + "/calendars")
      .get(import.meta.env.VITE_API_DOMAIN + "/api/calendars?format=json")
      .then((response) => {
        calendarList.value = response.data;

        if (!localStorage.getItem("selected-list")) {
          calendarList.value.forEach((list) => {
            selectedList.value.push(list.slug);
          });
        }
      });
  };

  const addCalendarList = async (data) => {
    await axios
      .post(
        // import.meta.env.VITE_API_DOMAIN + "/calendars",
        import.meta.env.VITE_API_DOMAIN + "/api/calendars",
        data,
        {
          headers: {
            "X-CSRFToken": this.$cookies.get("csrftoken"),
          },
        }
      )
      .then((response) => {
        calendarList.value.push(data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return {
    selectedList,
    addCalendarList,
    fetchList,
    updateSelectedList,
    getCalendarList,
    getSelectedList,
  };
});
