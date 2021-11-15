import React, { useState, useEffect, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import makeData from "./makeData";

const dummyData = makeData(100);

function Table({ columns, data, onSort }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy }
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true
    },
    useSortBy
  );

  useEffect(() => {
    onSort(sortBy);
  }, [onSort, sortBy]);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        accessor: "lastName"
      }
    ],
    []
  );

  const [data, setData] = useState([]);

  const handleSort = useCallback(sortBy => {
    //simulate remove server sort
    setTimeout(() => {
      // Doing multisort
      let sorted = dummyData.slice();
      sorted.sort((a, b) => {
        for (let i = 0; i < sortBy.length; ++i) {
          if (a[sortBy[i].id] > b[sortBy[i].id]) return sortBy[i].desc ? -1 : 1;
          if (a[sortBy[i].id] < b[sortBy[i].id]) return sortBy[i].desc ? 1 : -1;
        }
        return 0;
      });
      setData(sorted.slice(0, 10));
    }, 200);
  }, []);

  return <Table columns={columns} data={data} onSort={handleSort} />;
}

export default App;
