import axios from "axios";
const omrProcessing = async () => {
  const omrReq = await axios.post(
    "http://localhost:5000/api/OmrProcessing/process- omr"
  );
};
