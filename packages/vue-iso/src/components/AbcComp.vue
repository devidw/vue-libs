<script lang="ts" setup>
defineProps<{
  someProp?: string
}>()

defineExpose({
  _stories: {
    someStory: {
      props: {
        someProp: "Lorem ipsum",
      },
      slots: {
        someSlot: "Lorem ipsum",
      },
    },
    anotherStory: {
      props: {
        someProp: "Foo",
      },
      slots: {
        default: "Bar",
        someSlot: "Baz",
      },
    },
  },
})
</script>

<template>
  <div class="border p-4">
    <p>{{ someProp }}</p>
    <p>
      <slot />
      <slot name="someSlot" />
    </p>
  </div>
</template>
