<template>
  <section class="home">
    <div class="home-content p-4">
      <section class="flex">
        <div class="w-2/3 mx-2">
          <h2>About me</h2>
          <p>Bushwick Schlitz. Est Shoreditch small batch, dolor Schlitz sapiente twee stumptown ex. Duis Carles pickled, cornhole Thundercats McSweeney's minim PBR vegan Tumblr irony. Kogi eu Thundercats, sed scenester before they sold out et aesthetic.</p>
        </div>

        <div class="w-1/3 max-w-xs mx-2 mt-10 rounded shadow-lg">
          <img src="../assets/images/profile.jpg" alt="Portrait of Kyle Rollins." class="rounded" />
        </div>
      </section>
      <section class="flex mt-6">
        <div class="w-1/3 max-w-xs mx-2 mt-10">
          <svg
            width="64mm"
            height="25mm"
            viewBox="0 0 64 25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
          >
            <path d="M64,0l-49.913,0l-14.087,24.4l49.913,0l14.087,-24.4Z" style="fill:#356e84;" />
          </svg>
          <div class="flip-h">
            <svg
              class="fill-current"
              width="64mm"
              height="25mm"
              viewBox="0 0 64 25"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xml:space="preserve"
              xmlns:serif="http://www.serif.com/"
            >
              <path d="M64,0l-49.913,0l-14.087,24.4l49.913,0l14.087,-24.4Z" />
            </svg>
          </div>
          <svg
            width="64mm"
            height="25mm"
            viewBox="0 0 64 25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
          >
            <path d="M64,0l-49.913,0l-14.087,24.4l49.913,0l14.087,-24.4Z" style="fill:#356e84;" />
          </svg>
          <div class="flip-h">
            <svg
              class="fill-current"
              width="64mm"
              height="25mm"
              viewBox="0 0 64 25"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xml:space="preserve"
              xmlns:serif="http://www.serif.com/"
            >
              <path d="M64,0l-49.913,0l-14.087,24.4l49.913,0l14.087,-24.4Z" />
            </svg>
          </div>
        </div>

        <div class="w-2/3 mx-2">
          <h2>How this site was built</h2>
          <p>Cosby sweater plaid shabby chic kitsch pour-over ex. Try-hard fanny pack mumblecore cornhole cray scenester. Assumenda narwhal occupy, Blue Bottle nihil culpa fingerstache. Meggings kogi vinyl meh, food truck banh mi Etsy magna 90's duis typewriter banjo organic leggings Vice.</p>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home"
};
</script>

<style scoped>
.home {
  display: grid;
  grid-template-areas: "lmargin content rmargin";
  grid-template-columns: 0.2fr 1fr 0.2fr;
}

.home-content {
  grid-area: content;
}
</style>
