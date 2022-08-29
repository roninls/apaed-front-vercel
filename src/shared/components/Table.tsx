import React, { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';

export default function Table({
  columns,
  data,
  filterCriteria,
  filterBy,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  totalCount,
  currentPage,
  canGoToPage,
}) {
  const [filterInput, setFilterInput] = useState('');
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterCriteria, value);
    setFilterInput(value);
  };

  // Render the UI for your table
  return (
    <>
      <input value={filterInput} onChange={handleFilterChange} placeholder={`Filtrar por ${filterBy}`} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={i}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td key={i} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              // @ts-ignore
              <td colSpan="10000">Loading...</td>
            ) : (
              // @ts-ignore
              <td colSpan="10000">
                Mostrando {page.length} de {totalCount} resultados
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div className="pagination d-flex">
        <div className="flex-grow-1">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mx-2">
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mx-2">
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage} className="mx-2">
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mx-2">
            {'>>'}
          </button>
        </div>
        <span className="flex-grow-1">
          Página{' '}
          <span className="font-weight-bold">
            {pageIndex + 1} de {pageOptions.length}
          </span>{' '}
        </span>
        {canGoToPage && (
          <span className="flex-grow-1">
            Ir para Página:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
              className="mx-2 my-0 p-0"
            />
          </span>
        )}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
