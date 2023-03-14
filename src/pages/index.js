import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { mqttConnect, mqttSub, mqttPublish } from "../../Lib/mqttLib";
import Experiment from "../../components/Experiment";
import Graph from "../../components/Graph";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export default function Home() {
  const Experiment1 = useRef();
  const Experiment2 = useRef();
  const Experiment3 = useRef();
  const currData = useRef([]);

  const [currExperiment, setCurrExperiment] = useState(1);
  const [experiments, setExperiments] = useState([[], [], []]);
  const [client, setClient] = useState(null);
  const [time, setTime] = useState(0);

  const connect = async () => {
    setClient(mqttConnect());
  };

  const updateData = (index, data) => {
    console.log("wow");
    const expri = [...experiments];
    expri.at(index - 1).push(currData.current);
    setExperiments(expri);
  };

  const loadData = (data, old) => {
    const newData = old.concat(data);
    return newData;
  };

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("Connected");
        mqttSub(client, {
          topic: `CPE215_Group17/test/data`,
          qos: 0,
        });
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        console.log("Reconnecting");
      });
      client.on("message", (topic, message) => {
        if (
          Experiment1.current.getIsSubscribe() ||
          Experiment2.current.getIsSubscribe() ||
          Experiment3.current.getIsSubscribe()
        ) {
          if (message == "Start") {
            currData.current = [];
            console.log("123");
          } else if (message == "End") {
            if (currData.current != []) {
              if (Experiment1.current.getIsSubscribe()) {
                updateData(1);
                // Experiment1.current.setIndexExperi(experiments.at(0).length);
                Experiment1.current.close();
              } else if (Experiment2.current.getIsSubscribe()) {
                updateData(2);
                // Experiment2.current.setIndexExperi(experiments.at(1).length);
                Experiment2.current.close();
              } else if (Experiment3.current.getIsSubscribe()) {
                updateData(3);
                // Experiment3.current.setIndexExperi(experiments.at(2).length);
                Experiment3.current.close();
              }
              currData.current = [];
            }
          } else {
            var payload = { topic, message: JSON.parse(message) };
            currData.current = [
              ...loadData(payload.message.data, currData.current),
            ];
            console.log(currData.current);
          }
        }
      });
    } else {
      connect();
    }
  }, [client]);

  return (
    <div className="container">
      {/* --Header-- */}
      <div className="header">
        <h1>การทดลอง</h1>
        <h2>แรง และกฎของนิวตัน</h2>
      </div>

      {/* --Contents-- */}
      <div className="content">
        {/* Experiment1 */}
        <div className="inline">
          <h4>1. แรงต้านอากาศของร่มชูชีพ</h4>
        </div>
        ทำการปล่อยอุปกรณ์ เพื่อหาความเร่งในช่วงที่อุปกรณ์กางร่มและกำลังตกอยู่
        หลังจากนั้นทำการคำนวณแรงต้านอากาศของร่มโดยใช้สมการที่ (1.1)
        <BlockMath>F=ma -(1.1)</BlockMath>
        <Form className="detail">
          <Form.Group className="mb-3 inline" controlId="formHorizontalEmail">
            <Form.Label>น้ำหนักของอุปกรณ์ = 0.76 kg</Form.Label>
          </Form.Group>
        </Form>
        <Experiment
          id={1}
          ref={Experiment1}
          name="ทดลองปล่อยเพื่อหาความเร่ง"
          data={experiments.at(0)}
          time={time}
          client={client}
        >
          <div>
            <ul>
              <li>
                คุณต้องกดปุ่มที่อุปกรณ์ก่อนทำการปล่อย
                โดยเมื่อกดแล้วสามารถปล่อยเครื่องได้เลย
              </li>
              <li>เมื่อคุณปล่อยร่ม ร่มของคุณจะกางทันที</li>
            </ul>
          </div>
        </Experiment>
        <Form className="detail">
          <Form.Group className="mb-3 inline" controlId="formHorizontalEmail">
            <Form.Label>ความเร่งเมื่อร่มกลาง = </Form.Label>
            <Form.Control type="number" className="mx-2 mr-6" />
            <Form.Label>แรงต้านอากาศของร่มชูีพ = </Form.Label>
            <Form.Control type="number" className="mx-2" />
          </Form.Group>
        </Form>
        {/* Experiment2 */}
        <div className="inline">
          <h4>2. ความสูงของการกระโดด</h4>
        </div>
        จากแรงต้านอากาศของร่มในการทดลองที่ 1
        ให้คำนวณความสูงที่ต้องทำการปล่อยเพื่อให้ได้ความเร็วเมื่อถึงพื้นเป็น 4
        m/s
        <Form className="detail">
          <Form.Group className="mb-3" controlId="formHorizontalEmail">
            <Form.Label>
              ความสูงที่มากที่สุดที่จากทำให้ถึงพื้นด้วยความเร็ว 4 m/s ={" "}
            </Form.Label>
            <Form.Control type="number" />
          </Form.Group>
        </Form>
        <Experiment
          id={2}
          ref={Experiment2}
          data={experiments.at(1)}
          showV={true}
          time={time}
          client={client}
          name="ทดลองปล่อยเพื่อหาความเร็วปลาย เมื่อปล่อยจากความสูงที่คำนวณได้"
        >
          <div>
            <ul>
              <li>
                คุณต้องกดปุ่มที่อุปกรณ์ก่อนทำการปล่อย
                โดยเมื่อกดแล้วสามารถปล่อยเครื่องได้เลย
              </li>
              <li>เมื่อคุณปล่อยร่ม ร่มของคุณจะกางทันที</li>
            </ul>
          </div>
        </Experiment>
        <div className="mb-5"></div>
        {/* Experiment3 */}
        <div className="inline">
          <h4>3. จำลองสถานการณ์จริง</h4>
        </div>
        <Form className="detail">
          <Form.Group className="mb-3" controlId="formHorizontalEmail">
            <Form.Label>ปล่อยร่มที่ความสูง = 10 m </Form.Label>
            <br />
            <Form.Label>ความเร็วเมื่อตกถึงพื้น = 2 m/s</Form.Label>
            <br />
            <Form.Label>เวลาที่ต้องทำการปล่อย = </Form.Label>
            <Form.Control type="number" />
          </Form.Group>
        </Form>
        <Experiment
          id={3}
          ref={Experiment3}
          data={experiments.at(2)}
          showV={true}
          time={time}
          client={client}
          name="ทดลองปล่อยเพื่อให้ได้เวลาที่สั้นที่สุด"
        >
          <div>
            <Form.Group className="mb-3" controlId="formHorizontalEmail">
              <Form.Label>เวลาที่จะให้ร่มกาง = </Form.Label>
              <Form.Control
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
            <ul>
              <li>
                คุณต้องกดปุ่มที่อุปกรณ์ก่อนทำการปล่อย
                โดยเมื่อกดแล้วสามารถปล่อยเครื่องได้เลย
              </li>
              <li>เมื่อคุณปล่อยร่ม ร่มของคุณจะกางตามเวลาที่คุณกำหนด</li>
            </ul>
          </div>
        </Experiment>
      </div>
    </div>
  );
}
