import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Modal } from "react-bootstrap";
import { mqttPublish } from "../Lib/mqttLib";
import Graph from "./Graph";

const Experiment = forwardRef((props, _ref) => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(props.time);
  }, [props.time]);

  useEffect(() => {
    setChartData(props.data);
  }, [props.data]);

  useEffect(() => {
    setIndex(chartData.length - 1);
  }, [chartData]);

  useEffect(() => {
    console.log(index);
  }, [index]);

  const handleClose = () => {
    setShow(false);
    setIsSubscribe(false);
  };
  const handleShow = () => {
    setShow(true);
    setStatus(1);
  };
  const handleSubscribe = () => {
    setStatus(2);
    setIsSubscribe(true);
    mqttPublish(props.client, {
      topic: "CPE215_Group17/test/command",
      qos: 0,
      payload: `start|${props.id}|${props.id == 3 ? time : 0}`,
    });
  };

  useImperativeHandle(_ref, () => ({
    getIsSubscribe: () => {
      return isSubscribe;
    },
    close: () => {
      handleClose();
    },
  }));

  return (
    <>
      {chartData.length > 0 ? (
        <div style={{ display: "flex" }}>
          <select
            className="form-select"
            aria-label="Default select example"
            style={{ width: "70%", marginRight: "10px" }}
            value={index} // ...force the select's value to match the state variable...
            onChange={(e) => setIndex(e.target.value)}
          >
            {chartData.reverse().map((element, i) => {
              return (
                <option
                  value={chartData.length - i - 1}
                  key={chartData.length - i - 1}
                >{`การทดลองครั้งที่ ${chartData.length - i}`}</option>
              );
            })}
          </select>
          <Button onClick={handleShow}>ทดลองอีกครั้ง</Button>
        </div>
      ) : (
        <div className="experiment-container">
          <Button onClick={handleShow}>ทดลอง</Button>
        </div>
      )}
      <Graph data={props.data.at(index)} showV={props.showV}></Graph>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        {status === 1 ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleSubscribe}>
                รับทราบ
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="./parachute.png" style={{ width: "50%" }}></img>
                <div style={{ marginTop: "15px", fontSize: "24px" }}>
                  ปล่อยร่มของคุณได้เลย
                </div>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
});

export default React.memo(Experiment);
