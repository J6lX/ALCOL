// import { useTable } from "react-table";

// const ExampleTable = ({ inputData, outputData }) => {
//   const columns = [
//     {
//       accessor: "input",
//       Header: "Input",
//     },
//     {
//       accessor: "output",
//       Header: "Output",
//     },
//   ];

//   const data = useMemo(
//     () => [
//       {
//         input: inputData,
//         output: outputData,
//       },
//     ],
//     [inputData, outputData]
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//     columns,
//     data,
//   });

//   return (
//     <table {...getTableProps}>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map((column) => (
//               <th {...column.getHeaderProps()}>{column.render("Header")}</th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map((cell) => {
//                 return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
//               })}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

//         <ExampleTable
//           inputData={problem.prob_input_testcase}
//           outputData={problem.prob_output_testcase}
//         />
