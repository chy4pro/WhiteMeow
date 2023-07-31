<template>
  <main class="flex min-h-screen flex-col overflow-hidden">
    <div class="bg-box wh-full">
    <NavBar showLogo/>
    <div class="
      fixed
      w-111rem
      h-111rem
      rounded-50%
      bottom--60rem
      left--35rem
      bg-[rgba(241,143,219,0.21)]">
    </div>

    <div class="
      fixed
      w-42rem
      h-42rem
      rounded-50%
      top--12rem
      right-15.9rem
      bg-[rgba(241,143,219,0.21)]">
    </div>
    <router-view />
    </div>
  </main>
</template>

<script>
export default {
  name:'MainLayout'
}
</script>