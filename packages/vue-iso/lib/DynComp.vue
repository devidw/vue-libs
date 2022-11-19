<script lang="ts" setup>
import { type Component } from 'vue'
import { type Story } from './types'

defineProps<{
  comp: Component
  story: Story
}>()
</script>

<template>
  <component :is="comp" v-bind="story.props">
    <template v-for="(content, name) in story.slots" #[name]>
      {{ content }}
    </template>
  </component>
</template>
