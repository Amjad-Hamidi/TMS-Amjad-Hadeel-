import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface ITable {
  isDisplayCheckbox: boolean;
  columns: string[];
  bodydatatable: Record<string, any>[];
  actionsTable?:Record<string,()=>void>
}

const Table = ({ isDisplayCheckbox, columns, bodydatatable ,actionsTable}: ITable) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {isDisplayCheckbox && (
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  Select all
                </label>
              </div>
            </th>
          )}
          {columns.map((title, i) => (
            <th key={i} scope="col" className="px-6 py-3">
              {title}
            </th>
          ))}
          {actionsTable&&<th>actions</th>}
        </tr>
      </thead>
      <tbody>
        {bodydatatable.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {isDisplayCheckbox && (
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-row-${rowIndex}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label htmlFor={`checkbox-row-${rowIndex}`} className="sr-only">
                    Select row {rowIndex + 1}
                  </label>
                </div>
              </td>
            )}
            
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="px-6 py-4 ">
                {row[col]?? row[col]}
              </td>
            ))}

           <td className='flex gap-3  my-5  cursor-pointer '>
           {actionsTable&&Object.keys(actionsTable).map(action=>{
           switch (action) {
            case 'delete':{return <Trash2 color='red'/> }
            case 'edit':{return <Pencil color='green' /> }

           
            default:return null
              break;
           }
        })}
            </td>        
    
          </tr>

        ))}
 
      </tbody>
    </table>
  );
};

export default Table;
