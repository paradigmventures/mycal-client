<template v-if="isLoaded">
  <div v-for="calendar in calendars" :key="calendar.slug">
    <label class="group flex w-full items-center cursor-pointer rounded-md py-1 pl-8 pr-2 text-sm font-medium">
      <div class="rounded-full p-1" :class="[containerColorTags[calendar.color]]">

        <input class="form-checkbox align-text-bottom ml-2 rounded bg-gray-100 border-gray-300 focus:ring-2"
          :class="[checkboxColorTags[calendar.color]]" type="checkbox" checked="">

        <span class="inline-flex items-center rounded-full pl-2 pr-2.5 py-1 text-xs font-medium"
          :class="[labelColorTags[calendar.color]]">{{ calendar.title }}</span>

      </div>
    </label>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onBeforeMount } from "vue";

const isLoaded = ref(false);
const calendars = ref([])
const containerColorTags = ref({
  red: 'bg-red-100 hover:bg-red-200',
  orange: 'bg-orange-100 hover:bg-orange-200',
  amber: 'bg-amber-100 hover:bg-amber-200',
  yellow: 'bg-yellow-100 hover:bg-yellow-200',
  lime: 'bg-lime-100 hover:bg-lime-200',
  green: 'bg-green-100 hover:bg-green-200',
  emerald: 'bg-emerald-100 hover:bg-emerald-200',
  teal: 'bg-teal-100 hover:bg-teal-200',
  cyan: 'bg-cyan-100 hover:bg-cyan-200',
  sky: 'bg-sky-100 hover:bg-sky-200',
  blue: 'bg-blue-100 hover:bg-blue-200',
  indigo: 'bg-indigo-100 hover:bg-indigo-200',
  violet: 'bg-violet-100 hover:bg-violet-200',
  purple: 'bg-purple-100 hover:bg-purple-200',
  fuchsia: 'bg-fuchsia-100 hover:bg-fuchsia-200',
  pink: 'bg-pink-100 hover:bg-pink-200',
  rose: 'bg-rose-100 hover:bg-rose-200',
})

const checkboxColorTags = ref({
  red: 'text-red-600 focus:ring-red-500',
  orange: 'text-orange-600 focus:ring-orange-500',
  amber: 'text-amber-600 focus:ring-amber-500',
  yellow: 'text-yellow-600 focus:ring-yellow-500',
  lime: 'text-lime-600 focus:ring-lime-500',
  green: 'text-green-600 focus:ring-green-500',
  emerald: 'text-emerald-600 focus:ring-emerald-500',
  teal: 'text-teal-600 focus:ring-teal-500',
  cyan: 'text-cyan-600 focus:ring-cyan-500',
  sky: 'text-sky-600 focus:ring-sky-500',
  blue: 'text-blue-600 focus:ring-blue-500',
  indigo: 'text-indigo-600 focus:ring-indigo-500',
  violet: 'text-violet-600 focus:ring-violet-500',
  purple: 'text-purple-600 focus:ring-purple-500',
  fuchsia: 'text-fuchsia-600 focus:ring-fuchsia-500',
  pink: 'text-pink-600 focus:ring-pink-500',
  rose: 'text-rose-600 focus:ring-rose-500',
})

const labelColorTags = ref({
  red: 'text-red-800',
  orange: 'text-orange-800',
  amber: 'text-amber-800',
  yellow: ' text-yellow-800',
  lime: 'text-lime-800',
  green: 'text-green-800',
  emerald: 'text-emerald-800',
  teal: 'text-teal-800',
  cyan: 'text-cyan-800',
  sky: 'text-sky-800',
  blue: ' text-blue-800',
  indigo: 'text-indigo-800',
  violet: 'text-violet-800',
  purple: 'text-purple-800',
  fuchsia: 'text-fuchsia-800',
  pink: 'text-pink-800',
  rose: ' text-rose-800',
})



onBeforeMount(() => {
  axios
    .get(import.meta.env.VITE_API_DOMAIN + '/api/calendars?format=json')
    .then((response) => {
      calendars.value = response.data;
      isLoaded.value = true;
    })
})
</script>
