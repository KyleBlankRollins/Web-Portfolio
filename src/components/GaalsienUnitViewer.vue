<template>
  <div>
    <div class="shadow-lg bg-primary-light rounded">
      <h3 class="bg-callout m-0 px-2 py-2 rounded">{{ unit.name }}</h3>
      <img :src="unit.image" :alt="unit.name" />
      <div class="flex bg-white h-56 m-4 p-2 shadow-lg rounded items-center">
        <p>{{ unit.description }}</p>
      </div>
      <div class="flex">
        <div class="w-full mb-4 p-2 rounded">
          <div class="flex m-2 bg-white shadow-lg rounded items-center">
            <h4 class="px-2 self-center m-0">Speed:</h4>
            <p class="px-2 self-center">{{ unit.speed }}</p>
            <svg
              v-if="comparison.speed"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#50955d"
                stroke="#50955d"
              >
                <path
                  d="m138.09 118h-85.672l42.836-74.194 21.418 37.097zm-64.759-1.6749h43.845v70.943h-43.845z"
                  fill="#50955d"
                  stroke="#50955d"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else-if="comparison.speed === false"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#e74c3c"
                stroke="#e74c3c"
              >
                <path
                  d="m138.09 113.08h-85.672l42.836 74.194 21.418-37.097zm-64.759 1.6749h43.845v-70.943h-43.845z"
                  fill="#e74c3c"
                  stroke="#e74c3c"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(-51.914 -43.308)">
                <g
                  transform="translate(-10.658 7.9495)"
                  fill="#09f"
                  stroke="#09f"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.1397"
                >
                  <rect x="63.142" y="91.089" width="85.532" height="10.017" />
                  <rect x="63.142" y="114.07" width="85.532" height="10.017" />
                </g>
              </g>
            </svg>
          </div>
          <div class="flex m-2 bg-white shadow-lg rounded items-center">
            <h4 class="px-2 self-center m-0">Armor:</h4>
            <p class="px-2 self-center">{{ unit.armor }}</p>
            <svg
              v-if="comparison.armor"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#50955d"
                stroke="#50955d"
              >
                <path
                  d="m138.09 118h-85.672l42.836-74.194 21.418 37.097zm-64.759-1.6749h43.845v70.943h-43.845z"
                  fill="#50955d"
                  stroke="#50955d"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else-if="comparison.armor === false"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#e74c3c"
                stroke="#e74c3c"
              >
                <path
                  d="m138.09 113.08h-85.672l42.836 74.194 21.418-37.097zm-64.759 1.6749h43.845v-70.943h-43.845z"
                  fill="#e74c3c"
                  stroke="#e74c3c"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(-51.914 -43.308)">
                <g
                  transform="translate(-10.658 7.9495)"
                  fill="#09f"
                  stroke="#09f"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.1397"
                >
                  <rect x="63.142" y="91.089" width="85.532" height="10.017" />
                  <rect x="63.142" y="114.07" width="85.532" height="10.017" />
                </g>
              </g>
            </svg>
          </div>
          <div class="flex m-2 bg-white shadow-lg rounded items-center">
            <h4 class="px-2 self-center m-0">Damage:</h4>
            <p class="px-2 self-center">{{ unit.damage }}</p>
            <svg
              v-if="comparison.damage"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#50955d"
                stroke="#50955d"
              >
                <path
                  d="m138.09 118h-85.672l42.836-74.194 21.418 37.097zm-64.759-1.6749h43.845v70.943h-43.845z"
                  fill="#50955d"
                  stroke="#50955d"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else-if="comparison.damage === false"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#e74c3c"
                stroke="#e74c3c"
              >
                <path
                  d="m138.09 113.08h-85.672l42.836 74.194 21.418-37.097zm-64.759 1.6749h43.845v-70.943h-43.845z"
                  fill="#e74c3c"
                  stroke="#e74c3c"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(-51.914 -43.308)">
                <g
                  transform="translate(-10.658 7.9495)"
                  fill="#09f"
                  stroke="#09f"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.1397"
                >
                  <rect x="63.142" y="91.089" width="85.532" height="10.017" />
                  <rect x="63.142" y="114.07" width="85.532" height="10.017" />
                </g>
              </g>
            </svg>
          </div>
          <div class="flex m-2 bg-white shadow-lg rounded items-center">
            <h4 class="px-2 self-center m-0">Rate of Fire:</h4>
            <p class="px-2 self-center">{{ unit.rof }}</p>
          </div>
          <div class="flex m-2 bg-white shadow-lg rounded items-center">
            <h4 class="px-2 self-center m-0">Hull:</h4>
            <p class="px-2 self-center">{{ unit.hull }}</p>
            <svg
              v-if="comparison.hull"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#50955d"
                stroke="#50955d"
              >
                <path
                  d="m138.09 118h-85.672l42.836-74.194 21.418 37.097zm-64.759-1.6749h43.845v70.943h-43.845z"
                  fill="#50955d"
                  stroke="#50955d"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else-if="comparison.hull === false"
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(-51.914 -43.308)"
                fill="#e74c3c"
                stroke="#e74c3c"
              >
                <path
                  d="m138.09 113.08h-85.672l42.836 74.194 21.418-37.097zm-64.759 1.6749h43.845v-70.943h-43.845z"
                  fill="#e74c3c"
                  stroke="#e74c3c"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              v-else
              class="h-6"
              viewBox="0 0 86.672 144.46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(-51.914 -43.308)">
                <g
                  transform="translate(-10.658 7.9495)"
                  fill="#09f"
                  stroke="#09f"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.1397"
                >
                  <rect x="63.142" y="91.089" width="85.532" height="10.017" />
                  <rect x="63.142" y="114.07" width="85.532" height="10.017" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div class="w-full mb-4 p-2 rounded">
          <div class="flex m-2 bg-white shadow-lg rounded">
            <h4 class="px-2 self-center m-0">Strong:</h4>
            <p class="px-2 self-center">{{ unit.strong }}</p>
          </div>
          <div class="flex m-2 bg-white shadow-lg rounded">
            <h4 class="px-2 self-center m-0">Weak:</h4>
            <p class="px-2 self-center">{{ unit.weak }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GaalsienUnitViwer",
  props: {
    unit: Object,
    comparison: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
