import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { get } from "../../utils/api";

function UserNotes() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    get(`/user-service/user/logs?id=${id}`, (data) => setData(data.reverse()));
  }, [id]);

  console.log(data);

  return (
    data && (
      <>
        {data.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
        {data.length === 0 && "No records found."}
      </>
    )
  );
}

export default UserNotes;
