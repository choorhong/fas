import { useEffect, useState } from "react";
import "../../App.css";
import { generateRandomNumber } from "../../helpers";

const url = "https://reqres.in/api/users/";

type ListItemPropsType = {
  children?: React.ReactNode;
  onItemClick: (length: string | number) => void;
};

// Create a React component that displays a list of items retrieved from an API endpoint.
const ListItem = (props: ListItemPropsType) => {
  const { onItemClick } = props;
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseBody = await response.json();
        setData(responseBody.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="grid">
      {data?.map((item: Record<string, any>) => {
        return (
          <div
            key={item.email}
            className="grid-item"
            onClick={() => {
              onItemClick(generateRandomNumber(20));
            }}
          >
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        );
      })}
    </div>
  );
};

export default ListItem;
