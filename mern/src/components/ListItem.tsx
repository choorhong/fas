import React, { useImperativeHandle, useRef } from "react";
import "../App.css";

type ListItemPropsType = {
  children?: React.ReactNode;
  data?: Record<string, any>[];
  onToggleModal: () => void;
  onHandleEdit: () => void;
};

// Create a React component that displays a list of items retrieved from an API endpoint.
const ListItem = React.forwardRef<any, ListItemPropsType>(
  (props: ListItemPropsType, ref) => {
    const { data, onToggleModal, onHandleEdit } = props;
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

    const handleClick = (_item: Record<string, any>) => {
      // onHandleEdit();
      // onToggleModal();
    };

    return (
      <div className="grid">
        {data?.map((item: Record<string, any>, index) => {
          return (
            <div
              ref={() => (itemRef.current = item)}
              key={item._id || index}
              className="grid-item"
              onClick={() => {
                handleClick(item);
              }}
            >
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          );
        })}
      </div>
    );
  }
);

export default ListItem;
