<template>
  <section class="home">
    <div class="home-content p-4">
      <section class="flex">
        <div class="w-full md:w-2/3 mx-2">
          <h2>About me</h2>
          <p>Bushwick Schlitz. Est Shoreditch small batch, dolor Schlitz sapiente twee stumptown ex. Duis Carles pickled, cornhole Thundercats McSweeney's minim PBR vegan Tumblr irony. Kogi eu Thundercats, sed scenester before they sold out et aesthetic.</p>
        </div>

        <div class="hidden md:block md:w-1/3 mx-2 mt-10 rounded">
          <img class="h-64 rounded object-cover shadow-lg" src="../assets/images/profile.jpg" alt="Portrait of Kyle Rollins." />
        </div>
      </section>
      <section class="flex mt-6">
        <div class="w-1/3 mx-2 mt-10">
          <svg 
          viewBox="0 0 182 141" version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" 
            xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g>
              <path d="M0,71.659l141.486,0l39.931,69.165l-141.485,0l-39.932,-69.165Z" style="fill:#0d0c0d;fill-rule:nonzero;"/>
              <path d="M181.417,0l-141.485,0l-39.932,69.165l141.486,0l39.931,-69.165Z" style="fill:#356e84;fill-rule:nonzero;"/>
            </g>
          </svg>
          <svg 
          viewBox="0 0 182 141" version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" 
            xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g>
              <path d="M0,71.659l141.486,0l39.931,69.165l-141.485,0l-39.932,-69.165Z" style="fill:#0d0c0d;fill-rule:nonzero;"/>
              <path d="M181.417,0l-141.485,0l-39.932,69.165l141.486,0l39.931,-69.165Z" style="fill:#356e84;fill-rule:nonzero;"/>
            </g>
          </svg>
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
