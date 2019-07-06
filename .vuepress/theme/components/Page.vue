<template>
  <main>
    <slot name="top"/>

    <Content class="markdown-body rounded max-w-6xl"/>

    <slot name="bottom"/>
  </main>
</template>