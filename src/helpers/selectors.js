export function getAppointmentsForDay(state, day) {
  let apts = [];
  if (state.days.length !== 0) {
    apts = state.days.find((date) => date.name === day) ? state.days.find((date) => date.name === day).appointments : [];
  }

  return apts.map((apt) => {
    return state.appointments[apt];
  })
}