<template>
  <div>
    <TransitionRoot as="template" :show="mobileSidebarOpen">
      <Dialog
        as="div"
        class="relative z-40 md:hidden"
        @close="mobileSidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel
              class="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4"
            >
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    @click="mobileSidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <Sidebar />
            </DialogPanel>
          </TransitionChild>
          <div class="w-14 flex-shrink-0" aria-hidden="true">
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <!-- <div class="hidden md:fixed md:inset-y-0 md:flex md:w-14 md:flex-col" :class="[sideBarActualWidth]"> -->
    <div
      class="hidden md:fixed md:inset-y-0 md:flex md:flex-col"
      :class="['md:w-' + sideBarActualWidth]"
      @mouseenter="expandSideBar"
      @mouseleave="collapseSideBar"
    >
      <div class="flex w-full justify-between py-3 px-2 bg-white">
        <div class="flex flex-shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
        </div>

        <Bars3BottomLeftIcon
          v-if="desktopSidebarCollapsible"
          @click="desktopSidebarCollapsible = false"
          class="h-6 w-6 cursor-pointer"
          aria-hidden="true"
        />
        <Bars3Icon
          v-if="!desktopSidebarCollapsible"
          @click="desktopSidebarCollapsible = true"
          class="h-6 w-6 cursor-pointer"
          aria-hidden="true"
        />
      </div>

      <Sidebar :collapsed="desktopSidebarCollapsed" />
    </div>

    <div
      class="lg:min-h-screen flex flex-1 flex-col"
      :class="['md:pl-' + sideBarActualWidth]"
    >
      <div class="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
        <button
          type="button"
          class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          @click="mobileSidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex flex-1 justify-between px-4">
          <div class="flex flex-1"></div>
          <div class="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton
                  class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.href"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="lg:grow lg:h-full lg:flex lg:flex-col">
        <div class="lg:flex-1 lg:block p-6">
          <!-- begin calendar //-->
          <Calendar>
            <template #eventDialog="props">
              <div
                class="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-sm shadow-md"
              >
                <div class="col-span-2" />
                <div>
                  <div class="flex justify-end space-x-1 items-center">
                    <XMarkIcon
                      class="w-4 h-4 cursor-pointer text-gray-700 hover:text-black transition-colors"
                      @click="props.closeEventDialog"
                    />
                  </div>
                </div>

                <div
                  v-if="props.eventDialogData && props.eventDialogData.title"
                  class="col-span-2"
                >
                  <div>
                    <h2 class="text-sm md:text-base font-medium text-gray-700">
                      {{ props.eventDialogData.title }}
                    </h2>
                    <h4 class="text-xs md:text-sm text-gray-700">
                      {{
                        new Date(props.eventDialogData.start_dt).toDateString()
                      }}
                    </h4>

                    <h4
                      class="mt-3 mb-5 w-full flex space-x-2 justify-start whitespace-nowrap items-center"
                    >
                      <svg
                        class="h-2"
                        :class="[
                          getCircleColor(props.eventDialogData.calendar),
                        ]"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>

                      <span class="text-sm font-normal">
                        {{ props.eventDialogData.calendar }}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
            </template>
          </Calendar>
          <!-- /End calendar -->
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Calendar from "./components/Calendar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useCalendarColor } from "./composables/calendar-colors.js";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3BottomLeftIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, current: false, href: "#" },
  { name: "Calendar", icon: CalendarIcon, current: false, href: "#" },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

// Get calendar circle color
const { getCircleColor } = useCalendarColor();

const mobileSidebarOpen = ref(false);
const desktopSidebarCollapsible = ref(false);
const desktopSidebarCollapsed = ref(false);

const sideBarExpandedWidth = ref("64");
const sideBarCollapsedWidth = ref("14");
const sideBarActualWidth = ref(sideBarExpandedWidth.value);

const expandSideBar = () => {
  if (desktopSidebarCollapsible.value) {
    sideBarActualWidth.value = sideBarExpandedWidth.value;
    desktopSidebarCollapsed.value = false;
  }
  return;
};
const collapseSideBar = () => {
  if (desktopSidebarCollapsible.value) {
    sideBarActualWidth.value = sideBarCollapsedWidth.value;
    desktopSidebarCollapsed.value = true;
  }
  return;
};

// DO NOT DELETE
const tailwindClassSefeList = ["md:w-64", "md:w-14", "md:pl-64", "md:pl-14"];
</script>
