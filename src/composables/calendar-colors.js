import { ref } from "vue";
import { useCalendarListStore } from "../stores/calendar-list";

export function useCalendarColor() {
  // state encapsulated and managed by the composable

  const containerColorTags = ref({
    red: "bg-red-100 hover:bg-red-200",
    orange: "bg-orange-100 hover:bg-orange-200",
    amber: "bg-amber-100 hover:bg-amber-200",
    yellow: "bg-yellow-100 hover:bg-yellow-200",
    lime: "bg-lime-100 hover:bg-lime-200",
    green: "bg-green-100 hover:bg-green-200",
    emerald: "bg-emerald-100 hover:bg-emerald-200",
    teal: "bg-teal-100 hover:bg-teal-200",
    cyan: "bg-cyan-100 hover:bg-cyan-200",
    sky: "bg-sky-100 hover:bg-sky-200",
    blue: "bg-blue-100 hover:bg-blue-200",
    indigo: "bg-indigo-100 hover:bg-indigo-200",
    violet: "bg-violet-100 hover:bg-violet-200",
    purple: "bg-purple-100 hover:bg-purple-200",
    fuchsia: "bg-fuchsia-100 hover:bg-fuchsia-200",
    pink: "bg-pink-100 hover:bg-pink-200",
    rose: "bg-rose-100 hover:bg-rose-200",
  });

  const bgColorTags = ref({
    red: "bg-red-600 hover:bg-red-400",
    orange: "bg-orange-600 hover:bg-orange-400",
    amber: "bg-amber-600 hover:bg-amber-400",
    yellow: "bg-yellow-600 hover:bg-yellow-400",
    lime: "bg-lime-600 hover:bg-lime-400",
    green: "bg-green-600 hover:bg-green-400",
    emerald: "bg-emerald-600 hover:bg-emerald-400",
    teal: "bg-teal-600 hover:bg-teal-400",
    cyan: "bg-cyan-600 hover:bg-cyan-400",
    sky: "bg-sky-600 hover:bg-sky-400",
    blue: "bg-blue-600 hover:bg-blue-400",
    indigo: "bg-indigo-600 hover:bg-indigo-400",
    violet: "bg-violet-600 hover:bg-violet-400",
    purple: "bg-purple-600 hover:bg-purple-400",
    fuchsia: "bg-fuchsia-600 hover:bg-fuchsia-400",
    pink: "bg-pink-600 hover:bg-pink-400",
    rose: "bg-rose-600 hover:bg-rose-400",
  });

  const checkboxColorTags = ref({
    red: "text-red-600 focus:ring-red-500",
    orange: "text-orange-600 focus:ring-orange-500",
    amber: "text-amber-600 focus:ring-amber-500",
    yellow: "text-yellow-600 focus:ring-yellow-500",
    lime: "text-lime-600 focus:ring-lime-500",
    green: "text-green-600 focus:ring-green-500",
    emerald: "text-emerald-600 focus:ring-emerald-500",
    teal: "text-teal-600 focus:ring-teal-500",
    cyan: "text-cyan-600 focus:ring-cyan-500",
    sky: "text-sky-600 focus:ring-sky-500",
    blue: "text-blue-600 focus:ring-blue-500",
    indigo: "text-indigo-600 focus:ring-indigo-500",
    violet: "text-violet-600 focus:ring-violet-500",
    purple: "text-purple-600 focus:ring-purple-500",
    fuchsia: "text-fuchsia-600 focus:ring-fuchsia-500",
    pink: "text-pink-600 focus:ring-pink-500",
    rose: "text-rose-600 focus:ring-rose-500",
  });

  const labelColorTags = ref({
    red: "text-red-800",
    orange: "text-orange-800",
    amber: "text-amber-800",
    yellow: " text-yellow-800",
    lime: "text-lime-800",
    green: "text-green-800",
    emerald: "text-emerald-800",
    teal: "text-teal-800",
    cyan: "text-cyan-800",
    sky: "text-sky-800",
    blue: " text-blue-800",
    indigo: "text-indigo-800",
    violet: "text-violet-800",
    purple: "text-purple-800",
    fuchsia: "text-fuchsia-800",
    pink: "text-pink-800",
    rose: "text-rose-800",
  });

  // Calendar list store
  const calendarListStore = useCalendarListStore();

  /**
   * Get the current event container color
   * @param {string} calendarList The current calendar list
   */
  const getContainerColor = (calendarList) => {
    let listColor = calendarListStore.getCalendarList.filter(
      (list) => list.slug === calendarList
    );

    return containerColorTags.value[listColor[0].color];
  };

  /**
   * Get the current event text color
   * @param {string} calendarList The current calendar list
   */
  const getTextColor = (calendarList) => {
    let listColor = calendarListStore.getCalendarList.filter(
      (list) => list.slug === calendarList
    );

    return labelColorTags.value[listColor[0].color];
  };

  /**
   * Get the current event circle color
   * @param {string} calendarList The current calendar list
   */
  const getCircleColor = (calendarList) => {
    let listColor = calendarListStore.getCalendarList.filter(
      (list) => list.slug === calendarList
    );

    return checkboxColorTags.value[listColor[0].color];
  };

  /**
   * Get the current event background color
   * @param {string} calendarList The current calendar list
   */
  const getBgColor = (calendarList) => {
    let listColor = calendarListStore.getCalendarList.filter(
      (list) => list.slug === calendarList
    );

    return bgColorTags.value[listColor[0].color];
  };

  // expose managed state as return value
  return {
    containerColorTags,
    checkboxColorTags,
    labelColorTags,
    bgColorTags,
    getContainerColor,
    getTextColor,
    getCircleColor,
    getBgColor,
  };
}
