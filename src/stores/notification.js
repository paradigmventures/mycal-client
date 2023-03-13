import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useNotification = defineStore("notification", () => {
  // calendar(calendar list) notification
  const isCalendarListNotificationOpen = ref(false);
  // notification message
  const calendarNotificationMessage = ref("");

  /**
   * get the value of the calendar list notification
   */
  const getIfCalendarListNotificationIsOpen = computed(
    () => isCalendarListNotificationOpen.value
  );

  /**
   * get the calendar notification message
   */
  const getCalendarNotificationMessage = computed(
    () => calendarNotificationMessage.value
  );

  /**
   * set the calendar list notification value
   * @param {Boolean} value The height of the topnav to set
   */
  const setIfCalendarListNotificationIsOpen = (value, mssg) => {
    calendarNotificationMessage.value = mssg;
    isCalendarListNotificationOpen.value = value;
  };

  //-------------------------------------------------------------------------//

  return {
    getIfCalendarListNotificationIsOpen,
    getCalendarNotificationMessage,
    setIfCalendarListNotificationIsOpen,
  };
});
