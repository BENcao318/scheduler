import { useEffect, useReducer } from 'react';
import axios from 'axios';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
const SET_INTERVIEW = "SET_INTERVIEW";
const UPDATE_SPOTS = "UPDATE_SPOTS";



function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      }
    case SET_INTERVIEW: {
      return {
        ...state,
        appointments: action.appointments,
      }
    }
    case UPDATE_SPOTS: {
      return {
        ...state,
        days: action.days,
      }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  let id = null;
  let interview = null;

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })

  function setDay(day) {
    dispatch({ type: SET_DAY, day })
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments })
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
        dispatch({ type: SET_INTERVIEW, appointments });
        updateSpots(state.days, appointments);
      })
  }

  function updateSpots(stateDays, appointments) {
    let days = [...stateDays];            //copy the state.days to a new array. Otherwise the forEach loop will directly change the state data
    days.forEach((day) => {
      let spots = 0;
      day.appointments.forEach((appointmentId) => {
        if (!appointments[appointmentId].interview) {
          spots++;
        }
      })
      day.spots = spots;
    })

    dispatch({ type: UPDATE_SPOTS, days });
  }


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2],
      })
    })
  }, []);

  useEffect(() => {
    if (id && interview) {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      dispatch({ type: SET_INTERVIEW, appointments })
    }
  }, [id, interview, state.appointments])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8001');

    socket.onopen = function (event) {
      socket.send('ping');
    }

    socket.onmessage = function (event) {

      if (JSON.parse(event.data).type === SET_INTERVIEW) {
        let id = JSON.parse(event.data).id;
        let interview = JSON.parse(event.data).interview;

        if(interview) {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          dispatch({ type: SET_INTERVIEW, appointments })
        } else {
          const appointment = {
            ...state.appointments[id],
            interview: null
          };
      
          const appointments = {
            ...state.appointments,
            [id]: appointment
          }
          dispatch({ type: SET_INTERVIEW, appointments })
        }
      }

    }
    return () => {
      socket.close();
    }

  },[state.appointments])

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview,
  }
}