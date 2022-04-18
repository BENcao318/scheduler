import React from "react";
import "../Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "components/Form";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, false);
    props.bookInterview(props.id, interview)
      .then(() =>{
        transition(SHOW, false)
      });
  }

  function deleting() {
    transition(DELETING, false);
    props.deleteInterview(props.id)
      .then((response) => {
        transition(EMPTY, false)
      });
  }

  function confirmDeleting() {
    return true;
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => transition(CONFIRMING, false)}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status
          message={'Saving data'}
        />
      )}
      {mode === DELETING && (
        <Status
          message={'Deleting data'}
        />
      )}
      {mode === CONFIRMING && (
        <Confirm
          message={'Are you sure to delete item? '}
          onCancel={() => back()}
          onConfirm={deleting}
        />
      )}
    </article>
  )
}