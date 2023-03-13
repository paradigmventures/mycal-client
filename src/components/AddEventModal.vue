<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @click="$emit('closeModal')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 text-left shadow-xl transition-all sm:mt-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div
                class="absolute top-0 w-full hidden pt-4 pr-10 sm:flex sm:justify-between sm:items-center"
              >
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <PlusIcon
                    class="h-6 w-6 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div
                  class="grow lg:pr-12 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                >
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                    >{{ title }}</DialogTitle
                  >
                </div>
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="$emit('closeModal')"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="sm:flex sm:items-start sm:mt-5">
                <div
                  class="mx-auto flex sm:hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <PlusIcon
                    class="h-6 w-6 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="grow text-center sm:mt-0 sm:mx-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900 sm:hidden"
                    >{{ title }}</DialogTitle
                  >
                  <div class="mt-2">
                    <component
                      :is="components[formComponentIndex]"
                      @close-modal="$emit('closeModal')"
                    />
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { PlusIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import AddCalendarForm from "./AddCalendarForm.vue";
import AddEventForm from "./AddEventForm.vue";

defineProps({ open: Boolean, title: String, formComponentIndex: Number });

const components = [AddEventForm, AddCalendarForm];
</script>
