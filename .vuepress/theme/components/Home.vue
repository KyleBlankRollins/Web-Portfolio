<template>
  <main>
    <div class="md:flex lg:flex xl:flex">
      <Content class="w-full md:w-3/4 lg:w-3/4 xl:w-3/4 markdown-body rounded mr-5" />
      <div class="w-full md:w-1/4 lg:w-1/4 xl:w-1/4">
        <div class="shadow-md rounded mb-20">
          <img class="rounded" src="/images/Kyle.jpg" alt="Kyle and family at SeaWorld">
        </div>

        <div class="bg-primary-light shadow-md pb-2 my-2 rounded">
          <div class="text-center rounded">
            <p class="bg-secondary text-white font-display font-bold m-0 py-2 rounded-t">Write the Docs</p>
            <div class="gradient-bar h-1"></div>
          </div>
          <div class="mx-4 my-2 rounded border-4 border-white hover:border-4 hover:border-callout grow grow:hover rounded">
            <a href="https://www.meetup.com/wtd-dallas/">
              <img class="min-h-full" src="/images/v2-wide.svg" alt="Write the Docs Dallas logo">
            </a>
          </div>
          <div class="md:flex lg:flex xl:flex my-1 mx-3 rounded">
            <div class="w-1/3 rounded border-4 border-white hover:border-4 hover:border-callout grow grow:hover m-1">
              <a href="http://www.writethedocs.org/">
                <img class="min-h-full" src="/images/WTDgeneric.svg" alt="Write the Docs logo">
              </a>
            </div>
            <div class="w-2/3 bg-white rounded border-4 border-white hover:border-4 hover:border-callout grow grow:hover m-1 rounded">
              <a href="https://www.meetup.com/Write-the-Docs-SLC/">
                <img class="min-h-full" src="/images/WTD_slc.svg" alt="Write the Docs Salt Lake City logo">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
