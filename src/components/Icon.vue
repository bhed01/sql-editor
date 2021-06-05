<template>
  <i class="icon">
    <slot />
  </i>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 18px;
  color: inherit;
  &::after {
    content: " ";
    margin-right: 6px;
  }
}
</style>