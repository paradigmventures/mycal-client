<template>

  <div>
    <TransitionRoot as="template" :show="mobileSidebarOpen">
      <Dialog as="div" class="relative z-40 md:hidden" @close="mobileSidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
            leave-to="-translate-x-full">
            <DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    @click="mobileSidebarOpen = false">
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
    <div class="hidden md:fixed md:inset-y-0 md:flex md:flex-col" :class="['md:w-' + sideBarActualWidth]"
      @mouseenter="expandSideBar" @mouseleave="collapseSideBar">
      <div class="flex w-full justify-between py-3 px-2 bg-white">
        <div class="flex flex-shrink-0 items-center">
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company" />
        </div>

        <Bars3BottomLeftIcon v-if="desktopSidebarCollapsible" @click="desktopSidebarCollapsible = false"
          class="h-6 w-6 cursor-pointer" aria-hidden="true" />
        <Bars3Icon v-if="!desktopSidebarCollapsible" @click="desktopSidebarCollapsible = true"
          class="h-6 w-6 cursor-pointer" aria-hidden="true" />
      </div>

      <Sidebar :collapsed="desktopSidebarCollapsed" />
    </div>

    <div class="flex flex-1 flex-col" :class="['md:pl-' + sideBarActualWidth]">
      <div class="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
        <button type="button"
          class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          @click="mobileSidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex flex-1 justify-between px-4">
          <div class="flex flex-1">
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <button type="button"
              class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton
                  class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <a :href="item.href"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{ item.name }}</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main>
        <div class="p-6">
          <!-- begin calendar //-->
          <Calendar>
            <template #eventDialog="props">
              <div v-if="props.eventDialogData && props.eventDialogData.title"
                class="p-4 flex justify-center bg-gray-200 border border-gray-400 rounded-md">
                <div>
                  <div class="text-sm md:text-base font-bold text-gray-700 text-center">
                    {{ props.eventDialogData.title }}
                  </div>

                  <div class="mt-5">
                    <div class="text-xs text-gray-700 space-y-2">
                      <!-- your time -->
                      <h6 class="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><span class="font-medium">Your Time: </span>{{ props.eventDialogData.start_dt }}
                        </span>
                      </h6>

                      <!-- their time -->
                      <h6 class="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><span class="font-medium">Their Time: </span>{{ props.eventDialogData.start_dt }}
                        </span>
                      </h6>

                      <!-- tags -->
                      <h6 class="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                        <span class="font-medium italic">{{ props.eventDialogData.tags }}
                        </span>
                      </h6>

                      <!-- Location -->
                      <h6 class="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>

                        <span class="font-medium uppercase">{{
                          props.eventDialogData.location
                        }}</span>
                      </h6>
                    </div>

                    <div v-if="props.eventDialogData.image != null" class="w-full flex justify-center mt-5">
                      <img :src="'../public/' + props.eventDialogData.image" alt="launch image"
                        class="rounded-full h-36 w-36" />
                    </div>

                    <div class="w-full text-xs font-medium text-gray-700 mt-5">
                      {{ props.eventDialogData.description }}
                    </div>

                    <div class="w-full flex justify-center mt-6">
                      <div class="w-full flex items-center justify-between">
                        <button
                          class="close-flyout flex items-center space-x-2 bg-gray-400 py-1 px-3 text-xs hover:text-sm rounded-md text-gray-700 transition-all"
                          @click="props.closeEventDialog">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>close</span>
                        </button>
                        <a :href="props.eventDialogData.url"
                          class="bg-purple-600 rounded-md py-1 md:py-2 px-5 hover:px-6 shadow-md hover:bg-purple-700 transition-all">
                          <span class="text-xs md:text-sm font-medium text-white">See more</span>
                        </a>
                      </div>
                    </div>
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
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Bars3BottomLeftIcon, Bars3Icon, BellIcon, CalendarIcon, HomeIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, current: false, href: '#' },
  { name: 'Calendar', icon: CalendarIcon, current: false, href: '#' }
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

const mobileSidebarOpen = ref(false)
const desktopSidebarCollapsible = ref(false)
const desktopSidebarCollapsed = ref(false)

const sideBarExpandedWidth = ref('64')
const sideBarCollapsedWidth = ref('14')
const sideBarActualWidth = ref(sideBarExpandedWidth.value)

const expandSideBar = () => {
  if (desktopSidebarCollapsible.value) {
    sideBarActualWidth.value = sideBarExpandedWidth.value
    desktopSidebarCollapsed.value = false
  }
  return
}
const collapseSideBar = () => {
  if (desktopSidebarCollapsible.value) {
    sideBarActualWidth.value = sideBarCollapsedWidth.value
    desktopSidebarCollapsed.value = true
  }
  return
}

// DO NOT DELETE 
const tailwindClassSefeList = [
  'md:w-64', 'md:w-14', 'md:pl-64', 'md:pl-14'
]
</script>
