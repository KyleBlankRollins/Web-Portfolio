module.exports = {
  theme: {
    fontFamily: {
      'display': ['Oswald', 'sans-serif'],
      'displayB': ['Playfair Display', 'sans-serif'],
      'body': ['IBM Plex Sans', 'sans-serif'],
      'bodyB': ['Montserrat', 'sans-serif'],
      'mono': ['IBM Plex Mono', 'sans-serif']
    },
    extend: {
      colors: {
        'primary': '#082736',
        'primary-light': '#6290a4',
        'secondary': '#18151c',
        'secondary-light': '#756265',
        'callout': '#CC414F',
        'white': '#f8f8f8',
        'button-success': '#50955d',
        'button-primary': '#58587b',
        'button-info': '#17151c',
        'button-warning': '#cd8525',
        'button-danger': '#f44336',
        'button-default': '#999999'
      },
      boxShadow: {
        'default': '0 1px 3px 0 rgba(117, 98, 101, .6), 0 1px 2px 0 rgba(117, 98, 101, .6)',
        'md': ' 0 4px 6px -1px rgba(117, 98, 101, .6), 0 2px 4px -1px rgba(117, 98, 101, .6)',
        'lg': ' 0 10px 15px -3px rgba(117, 98, 101, .6), 0 4px 6px -2px rgba(117, 98, 101, .6)',
        'xl': ' 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, .25)',
        'inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
       ' outline': '0 0 0 3px rgba(66,153,225,0.5)',
        'none': 'none'
      }
    }
  },
  variants: {
    fill: ['responsive', 'hover', 'focus'],
    width: ['responsive', 'hover', 'focus'],
  },
  plugins: []
}
