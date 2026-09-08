export const ICONS = {
  code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)"><line x1="10.5" x2="6.5" y1=".5" y2="14.5"/><polyline points="7.328 2.672 7.328 8.328 1.672 8.328" transform="rotate(135 4.5 5.5)"/><polyline points="15.328 6.672 15.328 12.328 9.672 12.328" transform="scale(1 -1) rotate(-45 -10.435 0)"/></g></svg>',
  document:
    '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(4 3)"><path d="m12.5 12.5v-7l-5-5h-5c-1.1045695 0-2 .8954305-2 2v10c0 1.1045695.8954305 2 2 2h8c1.1045695 0 2-.8954305 2-2z"/><path d="m2.5 7.5h5"/><path d="m2.5 9.5h7"/><path d="m2.5 11.5h3"/><path d="m7.5.5v3c0 1.1045695.8954305 2 2 2h3"/></g></svg>',
  hierarchy:
    '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><path d="m5.5.5h6v5h-6z"/><path d="m10.5 11.5h6v5h-6z"/><path d="m.5 11.5h6v5h-6z"/><path d="m3.498 11.5v-3h10v3"/><path d="m8.5 8.5v-3"/></g></svg>',
  projector:
    '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(1 2)"><path d="m16.5 12.5v-10.01471863h-14v10.01471863c0 .5522847.44771525 1 1 1h12c.5522847 0 1-.4477153 1-1z"/><path d="m7.5 13.5-2 3.5"/><path d="m13.5 13.5-2 3" transform="matrix(-1 0 0 1 25 0)"/><path d="m.5 2.5h18"/><path d="m9.49894742.49789429c1.05502148.00261296 1.91822238.81840641 1.99543358 1.85289779l.0056181.1492082-4.00000003-.00210599c-.00105165-1.1045695.89437885-2 1.99894835-2z"/></g></svg>',
} as const;

export type IconName = keyof typeof ICONS;
