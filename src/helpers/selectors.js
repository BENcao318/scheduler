export function getAppointmentsForDay(state, day) {
  let apts = [];
  if (state.days.length !== 0) {
    apts = state.days.find((date) => date.name === day) ? state.days.find((date) => date.name === day).appointments : [];
  }

  return apts.map((apt) => {
    return state.appointments[apt];
  })
}

export function getInterview(state, interview) {
  return interview ? {
    'student': interview.student,
    'interviewer': state.interviewers.data[interview.interviewer] 
  } : null;
}

export function getInterviewersForDay(state, day) {
  let interviewers = [];
  if (state.days.length !== 0) {    //if days is not an empty array
    interviewers = state.days.find((date) => date.name === day) ? state.days.find((date) => date.name === day).interviewers : [];
  }

  return interviewers.map((int) => {
    return state.interviewers.data[int];
  })
}
