import React from "react";

import DayListItem from "./DaylistItem";

export default function DayList(props) {
  /* Use Array.map() to create a list of components with props and return them to the parent component.
    Each prop parameter is passed from the parent component (see index.js) and then used/invoked by the children component (see DaylistItem.js).
    The setDay function is passed into DayListItem with parameter. In order to not invoke it immediately, we need to wrap it with an anonymous function in the props (see DayListItem.js) so that a function definition is passed to the onClick event handler without invoking it. Every time an event happens, it will invoke the function that passed through props.
  */
  const dayListItem = props.days.map((day) => {
    return (
      <DayListItem 
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.value}
        setDay={() => props.onChange(day.name)}
      />
    )
  })
  return (
    <ul>
      {dayListItem}  
    </ul>
  )
}
