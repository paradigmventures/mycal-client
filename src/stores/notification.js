import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useNotification = defineStore("notification", () => {
  // calendar(calendar list) notification
  const isCalendarListNotificationOpen = ref(false);

  /**
   * get the value of the calendar list notification
   */
  const getIfCalendarListNotificationIsOpen = computed(
    () => isCalendarListNotificationOpen.value
  );

  /**
   * set the calendar list notification value
   * @param {Boolean} value The height of the topnav to set
   */
  const setIfCalendarListNotificationIsOpen = (value) => {
    isCalendarListNotificationOpen.value = value;
  };

  //-------------------------------------------------------------------------//

  return {
    getIfCalendarListNotificationIsOpen,
    setIfCalendarListNotificationIsOpen,
  };
});
