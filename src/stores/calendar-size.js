import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCalendarSizee = defineStore("calendar-size", () => {
  // top nav height
  const topNavHeight = ref(0);

  /**
   * set the heeeeight of the top nav
   * @param {Number} height The height of the topnav to set
   */
  const setTopNavHeight = (height) => {
    topNavHeight.value = height;
  };

  return {
    topNavHeight,
    setTopNavHeight,
  };
});
