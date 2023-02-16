import { ref } from "vue";
import { createPopper } from "@popperjs/core";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export function useEventListPopover(popoverRef) {
  // state encapsulated and managed by the composable
  const pShow = ref(false);
  const eList = ref([]);
  const pDay = ref(0);

  /**
   * get screen breakpoint to determine popover placement
   * left for desktop screens
   * bottom mobile screens
   */
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const largerThanMd = breakpoints.greater("md"); // only larger than md

  /**
   * Open or closes the popover
   * @param {event} evt The click event handler
   * @returns
   */
  const tPopover = (evt, todaysEvt, day) => {
    if (pShow.value == false) {
      eList.value = todaysEvt;
      pShow.value = true;
      pDay.value = day;
      createPopper(evt.target, popoverRef.value, {
        placement: largerThanMd.value ? "left" : "bottom",
      });
      return;
    }

    pShow.value = false;
    eList.value = [];
    pDay.value = 0;
  };

  // expose managed state as return value
  return { pDay, pShow, eList, tPopover };
}
