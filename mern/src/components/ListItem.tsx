import React, { useImperativeHandle, useRef } from "react";
import "../App.css";

type ListItemPropsType = {
  children?: React.ReactNode;
  data?: Record<string, any>[];
  onToggleModal: () => void;
  onHandleDelete: (id: string) => void;
};

// Create a React component that displays a list of items retrieved from an API endpoint.
const ListItem = React.forwardRef<any, ListItemPropsType>(
  (props: ListItemPropsType, ref) => {
    const { data, onHandleDelete } = props;
    const itemRef = useRef<any>();

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues() {
            return itemRef;
          },
        };
      },
      []
    );

    const handleDelete = async (id: string) => {
      try {
        const response = await fetch(`http://localhost/schedule/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) return;
        onHandleDelete(id);
      } catch (error) {
        console.error("error", (error as unknown as Error).message);
      }
    };

    return (
      <div className="grid">
        {data?.map((item: Record<string, any>, index) => {
          return (
            <div
              ref={() => (itemRef.current = item)}
              key={item._id || index}
              className="grid-item"
            >
              <pre>{JSON.stringify(item, null, 2)}</pre>
              <button
                className="delete-schedule-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete schedule
              </button>
            </div>
          );
        })}
      </div>
    );
  }
);

export default ListItem;
