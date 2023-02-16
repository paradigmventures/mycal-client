import { ref } from "vue";
import { createPopper } from "@popperjs/core";

export function useEventListPopover(popoverRef) {
  // state encapsulated and managed by the composable
  const pShow = ref(false);
  const eList = ref([]);
  const pDay = ref(0);

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
        placement: "left",
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
