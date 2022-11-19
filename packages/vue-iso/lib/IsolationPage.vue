<script lang="ts" setup>
import { ref, shallowRef, watch, type Ref, type Component, computed } from "vue"
import "uno.css"
import { type Story } from "./types"
import DynComp from "./DynComp.vue"

type Stories = Record<string, Story>
enum DefaultStoryOption {
  All,
}
type StorySelection = string | DefaultStoryOption

const error = ref("")
const compPath = ref("")
const comp: Ref<Component | null> = shallowRef(null)
const compRef: Ref<(Component & { _stories?: Stories }) | null> =
  shallowRef(null)
const stories: Ref<Stories> = ref({})
const storySelection: Ref<StorySelection> = ref(DefaultStoryOption.All)
const doGroup = ref(true)

const shouldGroup = computed(() => {
  return doGroup.value && storySelection.value === DefaultStoryOption.All
})

watch(compPath, async (path) => {
  if (!path) {
    return
  }
  // console.log('compPath changed', path)
  stories.value = {}
  storySelection.value = DefaultStoryOption.All
  compRef.value = null
  comp.value = null
  error.value = ""
  try {
    comp.value = (await import(path)).default
    // console.log(comp.value)
  } catch (err) {
    error.value = (err as Error).message
  }
})

watch(compRef, (val) => {
  // console.log('compRef changed', val)
  if (val && typeof val._stories === "object") {
    stories.value = val._stories
  }
})

watch(error, (err) => {
  if (err) {
    console.warn(err)
  }
})

if (import.meta.env.DEV) {
  compPath.value = "../src/components/AbcComp.vue"
}
</script>

<template>
  <div class="grid grid-cols-[1fr_300px] grid-gap-4">
    <div>
      <template v-if="error">
        <div class="bg-red text-dark font-mono p-4 rounded">
          {{ error }}
        </div>
      </template>
      <template v-else-if="comp">
        <div class="hidden">
          <!-- Used to access exposed -->
          <component :is="comp" ref="compRef" />
        </div>
        <div :class="{ 'grid grid-gap-4': shouldGroup }">
          <template v-if="storySelection === DefaultStoryOption.All">
            <template v-for="(story, index) in stories" :key="index">
              <span>
                <DynComp :comp="comp" :story="story" />
              </span>
            </template>
          </template>
          <template v-else>
            <DynComp :comp="comp" :story="stories[storySelection]" />
          </template>
        </div>
      </template>
    </div>

    <div id="sidebar" class="bg-dark-9 text-light p-4 rounded space-y-3">
      <input type="text" v-model="compPath" spellcheck="false" />
      <template v-if="!error && Object.keys(stories).length">
        <div
          class="grid grid-gap-3"
          :class="{ 'grid-cols-2': storySelection === DefaultStoryOption.All }"
        >
          <label
            :class="{
              active: storySelection === DefaultStoryOption.All,
            }"
          >
            <input
              type="radio"
              v-model="storySelection"
              :value="DefaultStoryOption.All"
            />
            All
          </label>
          <label
            v-if="storySelection === DefaultStoryOption.All"
            :class="{ active: doGroup }"
          >
            <input type="checkbox" v-model="doGroup" />
            Group
          </label>
        </div>
        <label
          v-for="storyName in Object.keys(stories)"
          :class="{ active: storySelection === storyName }"
        >
          <input type="radio" v-model="storySelection" :value="storyName" />
          {{ storyName }}
        </label>
      </template>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
#sidebar
  input[type="text"]
  label
    box-sizing border-box
    @apply block w-full bg-transparent text-light font-mono border-(1 dark-1) p-2 rounded outline-none

  input[type="text"]
    &:focus
       @apply border-green-7 bg-green-9 bg-opacity-25

    &::selection
      @apply bg-green text-dark

  label
    cursor pointer
    user-select none

  input[type="checkbox"]
  input[type="radio"]
    @apply hidden

  .active
    @apply font-bold border-green-7 bg-green-9 bg-opacity-25
</style>
