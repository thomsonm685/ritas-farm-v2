import VisibilitySensor from "react-visibility-sensor";
import { useState } from "react";

function VisibilitySensorComp(props) {
  const [visible, setVisible] = useState(false);

  const onChange = (isVisible) =>
    isVisible ? setVisible(true) : setVisible(false);

  return (
    <VisibilitySensor onChange={onChange}>{props.children}</VisibilitySensor>
  );
}

export default VisibilitySensorComp;
