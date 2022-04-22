import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        setState({...state, appointments});
        updateSpots(state.days, appointments);
      })
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
            .then((response) => {
              setState({...state, appointments});
              updateSpots(state.days, appointments);
            })
  }

  function updateSpots(stateDays, appointments) {
    let days = [...stateDays];            //copy the state.days to a new array. Otherwise the forEach loop will directly change the state data
    days.forEach((day) => {
      let spots = 0;
      day.appointments.forEach((appointmentId) => {
        if(!appointments[appointmentId].interview) {
          spots++;
        }
      })
      day.spots = spots;
    })

    setState({...state, days});
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2] }));
    })
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview,
  }
}